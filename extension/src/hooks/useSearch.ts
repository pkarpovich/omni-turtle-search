import { useEffect, useMemo, useState } from "react";

import { DotType } from "../components/Dot.tsx";
import { Config } from "../config/config.ts";
import { type SearchItem } from "../types/searchItem.ts";

export type SearchResponse = {
    providerName: DotType;
    items: SearchItem[];
};

type SearchResults = {
    providersStatus: SearchProviderStatus;
    error: Error | null;
    isLoading: boolean;
    data: SearchItem[];
};

export type SearchProviderStatus = {
    todoist: boolean;
    logseq: boolean;
    cubox: boolean;
};

const DefaultSearchProviderStatus: SearchProviderStatus = {
    todoist: false,
    logseq: false,
    cubox: false,
};

export const useSearch = (query: string): SearchResults => {
    const [data, setData] = useState<SearchResponse[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
        [data],
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

    return { data: processedData, providersStatus, isLoading, error };
};
