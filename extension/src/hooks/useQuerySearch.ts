import { useEffect, useState } from "react";

const getQuerySearch = (): string => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("q") ?? "";
};

export const useQuerySearch = (): string => {
    const [query, setQuery] = useState<string>(getQuerySearch);

    useEffect(() => {
        chrome.runtime.onMessage.addListener((request) => {
            if (request.message === "TabUpdated") {
                setQuery(getQuerySearch);
            }
        });
    }, []);

    return query;
};
