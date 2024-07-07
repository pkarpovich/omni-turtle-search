import { useCallback } from "react";

import styles from "./Header.module.css";
import { Logo } from "./Logo.tsx";

export const ExtensionSetupPrompt = () => {
    const handleClick = useCallback(async () => {
        try {
            await chrome.runtime.sendMessage({ action: "openOptionsPage" });
        } catch (error) {
            console.error(error);
        }
    }, []);

    return (
        <>
            <header className={styles.header}>
                <div />
                <div className={styles.text}>Omni Search</div>
                <Logo />
            </header>
            <button className={styles.optionsButton} onClick={handleClick} type="button">
                Go to the options page and set up the extension
            </button>
        </>
    );
};
