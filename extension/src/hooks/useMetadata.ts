import { useMemo } from "react";

import { BaseUrlKey, LogseqTokenKey, LogseqUrlKey, LogseqWorkspaceKey } from "../components/Options.tsx";
import { type Metadata } from "../types/metadata.ts";
import { useChromeStorage } from "./useChromeStorage.ts";

export const useMetadata = (): Metadata | null => {
    const [baseUrl] = useChromeStorage<string>(BaseUrlKey, "");
    const [logseqUrl] = useChromeStorage<string>(LogseqUrlKey, "");
    const [logseqToken] = useChromeStorage<string>(LogseqTokenKey, "");
    const [logseqWorkspace] = useChromeStorage<string>(LogseqWorkspaceKey, "");

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
    }, [logseqUrl, logseqToken, logseqWorkspace]);
};
