import { useCallback, useEffect, useMemo, useState } from "react";

import { DotType } from "../components/Dot.tsx";
import { BaseUrlKey, LogseqTokenKey, LogseqUrlKey, LogseqWorkspaceKey } from "../components/Options.tsx";
import { type SearchItem } from "../types/searchItem.ts";
import { useChromeStorage } from "./useChromeStorage.ts";

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

type LogseqMetadata = {
    workspace: string;
    token: string;
    url: string;
};

type Metadata = {
    logseq: LogseqMetadata;
};

export const useSearch = (query: string): SearchResults => {
    const [data, setData] = useState<SearchResponse[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hiddenProviders, setHiddenProviders] = useState<DotType[]>([]);

    const [baseUrl] = useChromeStorage<string>(BaseUrlKey, "");
    const [logseqUrl] = useChromeStorage<string>(LogseqUrlKey, "");
    const [logseqToken] = useChromeStorage<string>(LogseqTokenKey, "");
    const [logseqWorkspace] = useChromeStorage<string>(LogseqWorkspaceKey, "");

    const metadata = useMemo<Metadata | null>(() => {
        if (!logseqUrl) {
            console.warn("Logseq URL is not set");
        }

        if (!logseqToken) {
            console.warn("Logseq Token is not set");
        }

        if (!logseqWorkspace) {
            console.warn("Logseq Workspace is not set");
        }

        if (!logseqUrl || !logseqToken || !logseqWorkspace) {
            return null;
        }

        return {
            logseq: {
                workspace: logseqWorkspace,
                token: logseqToken,
                url: logseqUrl,
            },
        };
    }, [logseqUrl, logseqToken, logseqWorkspace]);

    useEffect(() => {
        if (!metadata || !baseUrl) {
            return;
        }

        setIsLoading(true);

        fetch(`${baseUrl}/search`, {
            body: JSON.stringify({
                metadata,
                query,
            }),
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        })
            .then((response) => response.json())
            .then((data: SearchResponse[]) => setData(data))
            .catch(setError)
            .finally(() => setIsLoading(false));
    }, [query, metadata]);

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
