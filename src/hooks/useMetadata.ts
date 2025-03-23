import { useMemo } from "react";

import { type Metadata } from "../types/metadata.ts";
import { BaseUrlKey } from "../types/storageKeys.ts";
import { useStorage } from "./useStorage.ts";

export const useMetadata = (): Metadata | null => {
    const [baseUrl, , isReady] = useStorage<string>(BaseUrlKey, "");

    return useMemo<Metadata | null>(() => {
        if (!isReady) {
            return null;
        }

        if (!baseUrl) {
            console.error("Base URL is not set");
            return null;
        }

        return {
            url: baseUrl,
        };
    }, [baseUrl, isReady]);
};
