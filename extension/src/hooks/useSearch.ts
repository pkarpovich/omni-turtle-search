import { useCallback, useEffect, useMemo, useState } from "react";

import { DotType } from "../components/Dot.tsx";
import { Config } from "../config/config.ts";
import { type SearchItem } from "../types/searchItem.ts";

export type SearchResponse = {
    providerName: DotType;
    items: SearchItem[];
};

type SearchResults = {
    toggleProviderVisibility: (provider: DotType) => void;
    providersStatus: SearchProviderStatus;
    hiddenProviders: DotType[];
    error: Error | null;
    isLoading: boolean;
    data: SearchItem[];
};

export type SearchProviderStatus = {
    todoist: boolean;
    logseq: boolean;
    notion: boolean;
    cubox: boolean;
};

const DefaultSearchProviderStatus: SearchProviderStatus = {
    todoist: false,
    logseq: false,
    notion: false,
    cubox: false,
};

export const useSearch = (query: string): SearchResults => {
    const [data, setData] = useState<SearchResponse[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hiddenProviders, setHiddenProviders] = useState<DotType[]>([]);

    useEffect(() => {
        setIsLoading(true);

        fetch(Config.SearchApiUrl, {
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query,
            }),
            method: "POST",
        })
            .then((response) => response.json())
            .then((data: SearchResponse[]) => setData(data))
            .catch(setError)
            .finally(() => setIsLoading(false));
    }, [query]);

    const processedData = useMemo(
        () =>
            data
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
        [data, hiddenProviders],
    );

    const providersStatus = useMemo<SearchProviderStatus>(
        () =>
            data.reduce<SearchProviderStatus>(
                (status, { providerName }) => ({
                    ...status,
                    [providerName]: true,
                }),
                DefaultSearchProviderStatus,
            ),
        [data],
    );

    const toggleProviderVisibility = useCallback((provider: DotType) => {
        setHiddenProviders((prev) =>
            prev.includes(provider) ? prev.filter((p) => p !== provider) : [...prev, provider],
        );
    }, []);

    return { toggleProviderVisibility, data: processedData, hiddenProviders, providersStatus, isLoading, error };
};
