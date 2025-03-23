import { useCallback, useMemo, useState } from "react";

import { DotType, isDotType } from "../types/dotType.ts";
import { type SearchItem } from "../types/searchItem.ts";
import { type AppEventSourceOptions, useEventSource } from "./useEventSource.ts";

export type SearchResponse = {
    providerName: DotType;
    error: string | null;
    items: SearchItem[];
};

type SearchResults = {
    toggleProviderVisibility: (provider: DotType) => void;
    providersStatus: SearchProviderStatus;
    connectionError: Error | null;
    hiddenProviders: DotType[];
    isLoading: boolean;
    data: SearchItem[];
};

export type ProviderStatus = {
    error: string | null;
    isLoading?: boolean;
    status: boolean;
    length: number;
    name: DotType;
};

export type SearchProviderStatus = Record<DotType, ProviderStatus>;

const DefaultSearchProviderStatus: SearchProviderStatus = {
    logseq: {
        name: DotType.logseq,
        isLoading: true,
        status: false,
        error: null,
        length: 0,
    },
    cubox: {
        name: DotType.cubox,
        isLoading: true,
        status: false,
        error: null,
        length: 0,
    },
};

export const useSearch = (url: string, query: string): SearchResults => {
    const [hiddenProviders, setHiddenProviders] = useState<DotType[]>([]);

    const eventRequestOptions = useMemo<AppEventSourceOptions>(
        () => ({
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
            disableLogger: true,
            disableRetry: true,
            method: "POST",
        }),
        [query],
    );

    const { isLoading, events, error } = useEventSource<SearchResponse>(`${url}/search`, query, eventRequestOptions);

    const processedData = useMemo(
        () =>
            Array.from(events.values())
                .filter((item) => !hiddenProviders.includes(item.providerName))
                .reduce<SearchItem[]>(
                    (allItems, item) => [
                        ...allItems,
                        ...item.items.map((i) => ({
                            ...i,
                            updateTime: new Date(i.updateTime),
                            providerName: item.providerName,
                        })),
                    ],
                    [],
                )
                .sort((a, b) => b.updateTime.getTime() - a.updateTime.getTime()),
        [events, hiddenProviders],
    );

    const providersStatus = useMemo<SearchProviderStatus>(() => {
        const status = { ...DefaultSearchProviderStatus };
        const respondedProviders = new Set<DotType>();

        Array.from(events.values()).forEach(({ error: providerError, providerName }) => {
            respondedProviders.add(providerName);

            status[providerName] = {
                length: events.get(providerName)?.items.length ?? 0,
                status: !providerError,
                error: providerError,
                name: providerName,
                isLoading: false,
            };
        });

        if (error && !isLoading) {
            Object.entries(status).forEach(([providerName, providerStatus]) => {
                if (!isDotType(providerName)) {
                    return;
                }

                const providerType = DotType[providerName];
                if (!respondedProviders.has(providerType)) {
                    status[providerName] = {
                        ...providerStatus,
                        error: "Connection interrupted",
                        isLoading: false,
                        status: false,
                    };
                }
            });
        }

        return status;
    }, [error, events, isLoading]);

    const toggleProviderVisibility = useCallback((provider: DotType) => {
        setHiddenProviders((prev) =>
            prev.includes(provider) ? prev.filter((p) => p !== provider) : [...prev, provider],
        );
    }, []);

    return {
        toggleProviderVisibility,
        connectionError: error,
        data: processedData,
        hiddenProviders,
        providersStatus,
        isLoading,
    };
};
