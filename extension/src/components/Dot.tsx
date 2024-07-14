import clsx from "clsx";
import { useCallback } from "react";

import { DotType } from "../types/dotType.ts";
import styles from "./Dot.module.css";

type Props = {
    onClick?: (provider: DotType) => void;
    unfilled?: boolean;
    loading?: boolean;
    small?: boolean;
    length?: number;
    error?: string;
    type: DotType;
};

export const Dot = ({ unfilled, loading, onClick, length, error, small, type }: Props) => {
    const handleClick = useCallback(() => {
        if (onClick && !loading && !error) {
            onClick(type);
        }
    }, [onClick, type, loading, error]);

    return (
        <div className={styles.container}>
            <button
                className={clsx(
                    {
                        [styles.pointer]: Boolean(onClick) && !loading && !error,
                        [styles.unfilled]: Boolean(unfilled) && !loading,
                        [styles.todoistDot]: type === DotType.todoist,
                        [styles.logseqDot]: type === DotType.logseq,
                        [styles.notionDot]: type === DotType.notion,
                        [styles.error]: Boolean(error) && !loading,
                        [styles.cuboxDot]: type === DotType.cubox,
                        [styles.loading]: Boolean(loading),
                        [styles.small]: Boolean(small),
                    },
                    styles.dot,
                )}
                onClick={handleClick}
                title={error}
                type="button"
            />
            {!small ? <span className={styles.length}>{length}</span> : null}
        </div>
    );
};
