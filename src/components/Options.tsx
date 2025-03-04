import { type ChangeEvent, useCallback } from "react";

import { useStorage } from "../hooks/useStorage.ts";
import { BaseUrlKey } from "../types/storageKeys.ts";
import styles from "./Options.module.css";

export const Options = () => {
    const [baseUrl, setBaseUrl] = useStorage<string>(BaseUrlKey, "");

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const { value, name } = e.target;

            switch (name) {
                case BaseUrlKey:
                    setBaseUrl(value);
                    break;
            }
        },
        [setBaseUrl],
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
        </form>
    );
};
