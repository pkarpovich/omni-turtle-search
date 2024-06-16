import clsx from "clsx";

import styles from "./Dot.module.css";

export enum DotType {
    todoist = "todoist",
    logseq = "logseq",
    notion = "notion",
    cubox = "cubox",
}

type Props = {
    unfilled?: boolean;
    type: DotType;
};

export const Dot = ({ unfilled, type }: Props) => (
    <span
        className={clsx(
            {
                [styles.todoistDot]: type === DotType.todoist,
                [styles.logseqDot]: type === DotType.logseq,
                [styles.notionDot]: type === DotType.notion,
                [styles.cuboxDot]: type === DotType.cubox,
                [styles.unfilled]: Boolean(unfilled),
            },
            styles.dot,
        )}
    />
);
