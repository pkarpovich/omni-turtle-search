import { useCallback } from "react";

import styles from "./Header.module.css";
import { Logo } from "./Logo.tsx";
import { Options } from "./Options.tsx";

type Props = {
    isStandalone: boolean;
};

export const ExtensionSetupPrompt = ({ isStandalone }: Props) => {
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
            {isStandalone ? (
                <Options />
            ) : (
                <button className={styles.optionsButton} onClick={handleClick} type="button">
                    Go to the options page and set up the extension
                </button>
            )}
        </>
    );
};
