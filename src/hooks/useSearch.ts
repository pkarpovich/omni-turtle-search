import { useCallback, useMemo, useState } from "react";

import { DotType } from "../types/dotType.ts";
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
    hiddenProviders: DotType[];
    isLoading: boolean;
    data: SearchItem[];
};

export type ProviderStatus = {
    isLoading?: boolean;
    status: boolean;
    length: number;
    error?: string;
    name: DotType;
};

export type SearchProviderStatus = {
    logseq: ProviderStatus;
    cubox: ProviderStatus;
};

const DefaultSearchProviderStatus: SearchProviderStatus = {
    logseq: {
        name: DotType.logseq,
        isLoading: true,
        status: false,
        length: 0,
    },
    cubox: {
        name: DotType.cubox,
        isLoading: true,
        status: false,
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

    const { isLoading, events } = useEventSource<SearchResponse>(`${url}/search`, query, eventRequestOptions);

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

    const providersStatus = useMemo<SearchProviderStatus>(
        () =>
            Array.from(events.values()).reduce<SearchProviderStatus>(
                (status, { providerName, error }) => ({
                    ...status,
                    [providerName]: {
                        length: events.get(providerName)?.items.length ?? 0,
                        name: providerName,
                        isLoading: false,
                        status: !error,
                        error,
                    },
                }),
                DefaultSearchProviderStatus,
            ),
        [events],
    );

    const toggleProviderVisibility = useCallback((provider: DotType) => {
        setHiddenProviders((prev) =>
            prev.includes(provider) ? prev.filter((p) => p !== provider) : [...prev, provider],
        );
    }, []);

    return { toggleProviderVisibility, data: processedData, hiddenProviders, providersStatus, isLoading };
};
