import { type ChangeEvent, type KeyboardEvent, type MouseEvent, useCallback, useState } from "react";

import ClearIcon from "../assets/clear-icon.svg";
import SearchIcon from "../assets/search-icon.svg";
import styles from "./Input.module.css";

type Props = {
    onChange: (value: string) => void;
    initialQuery: string;
};

export const Input = ({ initialQuery, onChange }: Props) => {
    const [value, setValue] = useState<string>(initialQuery);

    const handleChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
        event.stopPropagation();

        setValue(event.target.value);
    }, []);

    const handleReset = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();

        setValue("");
    }, []);

    const handleSubmit = useCallback(
        (event: KeyboardEvent<HTMLTextAreaElement> | MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();

            onChange(value);
        },
        [onChange, value],
    );

    const handleEnterClick = useCallback(
        (event: KeyboardEvent<HTMLTextAreaElement>) => {
            switch (event.key) {
                case "Enter":
                    event.preventDefault();

                    handleSubmit(event);
                    break;

                default:
                    break;
            }
        },
        [handleSubmit],
    );

    return (
        <div className={styles.container}>
            <textarea
                placeholder="Let's fetch ..."
                onKeyDown={handleEnterClick}
                className={styles.input}
                onChange={handleChange}
                data-multiline="false"
                autoCapitalize="off"
                spellCheck="false"
                autoComplete="off"
                autoCorrect="off"
                maxLength={1024}
                value={value}
                rows={1}
                name="q"
            />
            <div className={styles.iconsContainer}>
                <button className={styles.iconButton} onClick={handleReset} type="button">
                    <ClearIcon />
                </button>
                <div className={styles.separator} />
                <button className={styles.iconButton} onClick={handleSubmit} type="button">
                    <SearchIcon />
                </button>
            </div>
        </div>
    );
};
