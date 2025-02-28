import { useMemo } from "react";

import { type Metadata } from "../types/metadata.ts";
import { BaseUrlKey, LogseqTokenKey, LogseqUrlKey, LogseqWorkspaceKey } from "../types/storageKeys.ts";
import { useStorage } from "./useStorage.ts";

export const useMetadata = (): Metadata | null => {
    const [baseUrl] = useStorage<string>(BaseUrlKey, "");
    const [logseqUrl] = useStorage<string>(LogseqUrlKey, "");
    const [logseqToken] = useStorage<string>(LogseqTokenKey, "");
    const [logseqWorkspace] = useStorage<string>(LogseqWorkspaceKey, "");

    return useMemo<Metadata | null>(() => {
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
            url: baseUrl,
        };
    }, [logseqUrl, logseqToken, logseqWorkspace, baseUrl]);
};
