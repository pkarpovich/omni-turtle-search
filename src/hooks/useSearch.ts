import { useCallback, useMemo, useState } from "react";

import { DotType } from "../types/dotType.ts";
import { type Metadata } from "../types/metadata.ts";
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
    todoist: ProviderStatus;
    logseq: ProviderStatus;
    notion: ProviderStatus;
    cubox: ProviderStatus;
};

const DefaultSearchProviderStatus: SearchProviderStatus = {
    todoist: {
        name: DotType.todoist,
        isLoading: true,
        status: false,
        length: 0,
    },
    logseq: {
        name: DotType.logseq,
        isLoading: true,
        status: false,
        length: 0,
    },
    notion: {
        name: DotType.notion,
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

export const useSearch = (query: string, metadata: Metadata): SearchResults => {
    const [hiddenProviders, setHiddenProviders] = useState<DotType[]>([]);

    const eventRequestOptions = useMemo<AppEventSourceOptions>(
        () => ({
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ metadata, query }),
            disableLogger: true,
            disableRetry: true,
            method: "POST",
        }),
        [metadata, query],
    );

    const { isLoading, events } = useEventSource<SearchResponse>(`${metadata.url}/search`, query, eventRequestOptions);

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
