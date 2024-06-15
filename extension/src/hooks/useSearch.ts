import { useEffect, useMemo, useState } from "react";

import { Config } from "../config/config.ts";
import { type SearchItem } from "../types/searchItem.ts";

export type SearchResponse = {
    data: SearchItem[];
};

type SearchResults = {
    error: Error | null;
    isLoading: boolean;
    data: SearchItem[];
};

export const useSearch = (query: string): SearchResults => {
    const [data, setData] = useState<SearchItem[]>([]);
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
            .then(({ data }: SearchResponse) => setData(data))
            .catch(setError)
            .finally(() => setIsLoading(false));
    }, [query]);

    const processedData = useMemo(
        () =>
            data.map((item) => ({
                ...item,
                updateTime: new Date(item.updateTime),
            })),
        [data],
    );

    return { data: processedData, isLoading, error };
};
