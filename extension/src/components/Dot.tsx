import clsx from "clsx";

import styles from "./Dot.module.css";

export enum DotType {
    Logseq = "logseq",
    Cubox = "cubox",
}

type Props = {
    unfilled?: boolean;
    type: DotType;
};

export const Dot = ({ unfilled, type }: Props) => (
    <span
        className={clsx(
            {
                [styles.logseqDot]: type === DotType.Logseq,
                [styles.cuboxDot]: type === DotType.Cubox,
                [styles.unfilled]: Boolean(unfilled),
            },
            styles.dot,
        )}
    />
);
