import { type ChangeEvent, useCallback } from "react";

import { useStorage } from "../hooks/useStorage.ts";
import { BaseUrlKey, LogseqTokenKey, LogseqUrlKey, LogseqWorkspaceKey } from "../types/storageKeys.ts";
import styles from "./Options.module.css";

export const Options = () => {
    const [baseUrl, setBaseUrl] = useStorage<string>(BaseUrlKey, "");
    const [logseqUrl, setLogseqUrl] = useStorage<string>(LogseqUrlKey, "");
    const [logseqToken, setLogseqToken] = useStorage<string>(LogseqTokenKey, "");
    const [logseqWorkspace, setLogseqWorkspace] = useStorage<string>(LogseqWorkspaceKey, "");

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const { value, name } = e.target;

            switch (name) {
                case BaseUrlKey:
                    setBaseUrl(value);
                    break;

                case LogseqUrlKey:
                    setLogseqUrl(value);
                    break;

                case LogseqTokenKey:
                    setLogseqToken(value);
                    break;

                case LogseqWorkspaceKey:
                    setLogseqWorkspace(value);
                    break;
            }
        },
        [setBaseUrl, setLogseqToken, setLogseqUrl, setLogseqWorkspace],
    );

    return (
        <form className={styles.form}>
            <fieldset>
                <legend>General</legend>
                <div className={styles.formRow}>
                    <label className={styles.formLabel} htmlFor={BaseUrlKey}>
                        Base URL:
                    </label>
                    <input
                        className={styles.formInput}
                        onChange={handleChange}
                        name={BaseUrlKey}
                        value={baseUrl}
                        id={BaseUrlKey}
                        type="text"
                    />
                </div>
            </fieldset>
            <fieldset>
                <legend>Logseq</legend>
                <div className={styles.formRow}>
                    <label className={styles.formLabel} htmlFor={LogseqUrlKey}>
                        URL:
                    </label>
                    <input
                        className={styles.formInput}
                        onChange={handleChange}
                        name={LogseqUrlKey}
                        value={logseqUrl}
                        id={LogseqUrlKey}
                        type="text"
                    />
                </div>
                <div className={styles.formRow}>
                    <label className={styles.formLabel} htmlFor={LogseqTokenKey}>
                        Token:
                    </label>
                    <input
                        className={styles.formInput}
                        onChange={handleChange}
                        name={LogseqTokenKey}
                        value={logseqToken}
                        id={LogseqTokenKey}
                        type="text"
                    />
                </div>
                <div className={styles.formRow}>
                    <label className={styles.formLabel} htmlFor={LogseqWorkspaceKey}>
                        Workspace:
                    </label>
                    <input
                        className={styles.formInput}
                        name={LogseqWorkspaceKey}
                        onChange={handleChange}
                        value={logseqWorkspace}
                        id={LogseqWorkspaceKey}
                        type="text"
                    />
                </div>
            </fieldset>
        </form>
    );
};
