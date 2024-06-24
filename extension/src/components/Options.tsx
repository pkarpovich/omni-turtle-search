import { type ChangeEvent, useCallback } from "react";

import { useChromeStorage } from "../hooks/useChromeStorage.ts";
import styles from "./Options.module.css";

export const BaseUrlKey = "baseUrl";
export const LogseqUrlKey = "logseqUrl";
export const LogseqTokenKey = "loggseqToken";
export const LogseqWorkspaceKey = "logseqWorkspace";

export const Options = () => {
    const [baseUrl, setBaseUrl] = useChromeStorage<string>(BaseUrlKey, "");
    const [logseqUrl, setLogseqUrl] = useChromeStorage<string>(LogseqUrlKey, "");
    const [logseqToken, setLogseqToken] = useChromeStorage<string>(LogseqTokenKey, "");
    const [logseqWorkspace, setLogseqWorkspace] = useChromeStorage<string>(LogseqWorkspaceKey, "");

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
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
    }, []);

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
