import clsx from "clsx";

import { formatDate } from "../utils/formatDate.ts";
import { Dot, DotType } from "./Dot.tsx";
import styles from "./SearchResultItem.module.css";

type Props = {
    description: string;
    title: string;
    url: string;
    date: Date;
};

export const SearchResultItem = ({ description, title, date, url }: Props) => (
    <div className={styles.resultItem}>
        <div className={styles.titleContainer}>
            <Dot type={DotType.Cubox} />
            <a
                className={clsx(styles.title, styles.oneLineText)}
                rel="noreferrer"
                target="_blank"
                title={title}
                href={url}
            >
                {title}
            </a>
        </div>
        <div className={clsx(styles.url, styles.oneLineText)}>{url}</div>
        <p className={styles.description}>
            <span className={styles.date}>{formatDate(date)}</span>
            {description}
        </p>
    </div>
);
