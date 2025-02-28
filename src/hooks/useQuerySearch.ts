import { useCallback, useState } from "react";

import { useMutationObservable } from "./useMutationObservable.ts";

const getDefaultQuerySearch = (): string => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("q") ?? "";
};

export const useQuerySearch = (): [string, (value: string) => void] => {
    const [query, setQuery] = useState<string>(getDefaultQuerySearch);

    const handleChange = useCallback((newValue: string) => {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("q", newValue);
        window.history.replaceState({}, "", `${window.location.pathname}?${urlParams.toString()}`);

        setQuery(newValue);
    }, []);

    const handleSearchBarMutation = useCallback((mutations: MutationRecord[]) => {
        for (const mutation of mutations) {
            if (mutation.type === "childList" && mutation.target instanceof HTMLTextAreaElement) {
                setQuery(mutation.target.defaultValue);
            }
        }
    }, []);

    useMutationObservable("#searchBar", handleSearchBarMutation);

    return [query, handleChange];
};
