import clsx from "clsx";
import { useCallback } from "react";

import styles from "./Dot.module.css";

export enum DotType {
    todoist = "todoist",
    logseq = "logseq",
    notion = "notion",
    cubox = "cubox",
}

type Props = {
    onClick?: (provider: DotType) => void;
    unfilled?: boolean;
    loading?: boolean;
    small?: boolean;
    error?: string;
    type: DotType;
};

export const Dot = ({ unfilled, loading, onClick, error, small, type }: Props) => {
    const handleClick = useCallback(() => {
        if (onClick && !loading && !error) {
            onClick(type);
        }
    }, [onClick, type, loading, error]);

    return (
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
    );
};
