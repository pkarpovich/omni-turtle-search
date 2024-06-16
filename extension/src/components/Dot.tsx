import clsx from "clsx";

import styles from "./Dot.module.css";

export enum DotType {
    logseq = "logseq",
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
                [styles.logseqDot]: type === DotType.logseq,
                [styles.cuboxDot]: type === DotType.cubox,
                [styles.unfilled]: Boolean(unfilled),
            },
            styles.dot,
        )}
    />
);
