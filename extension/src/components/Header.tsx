import { Dot, DotType } from "./Dot.tsx";
import styles from "./Header.module.css";

type Props = {
    itemsLength: number;
    isLoading: boolean;
};

export const Header = ({ itemsLength, isLoading }: Props) => (
    <header className={styles.header}>
        <div>
            <Dot type={DotType.Cubox} />
            <Dot type={DotType.Logseq} />
        </div>
        <div className={styles.text}>{isLoading ? "Loading..." : itemsLength === 0 ? "No results" : `Omni Search`}</div>
        <picture>
            <source srcSet="https://fonts.gstatic.com/s/e/notoemoji/latest/1f422/512.webp" type="image/webp" />
            <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f422/512.gif" height="32" width="32" alt="🐢" />
        </picture>
    </header>
);
