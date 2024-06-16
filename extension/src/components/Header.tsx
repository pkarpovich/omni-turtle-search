import { type SearchProviderStatus } from "../hooks/useSearch.ts";
import { Dot, DotType } from "./Dot.tsx";
import styles from "./Header.module.css";
import { Logo } from "./Logo.tsx";

type Props = {
    providersStatus: SearchProviderStatus;
    onCollapseChange: () => void;
    isCollapsed: boolean;
    itemsLength: number;
    isLoading: boolean;
};

export const Header = ({ onCollapseChange, providersStatus, itemsLength, isCollapsed, isLoading }: Props) => (
    <header className={styles.header}>
        <div>
            <Dot unfilled={!providersStatus.cubox} type={DotType.Cubox} />
            <Dot unfilled={!providersStatus.logseq} type={DotType.Logseq} />
        </div>
        <div className={styles.text}>{isLoading ? "Loading..." : itemsLength === 0 ? "No results" : `Omni Search`}</div>
        <div className={styles.actionsContainer}>
            <Logo />
            {isCollapsed ? (
                <button className={styles.expandButton} onClick={onCollapseChange} type="button">
                    &#x25B2;
                </button>
            ) : (
                <button className={styles.collapseButton} onClick={onCollapseChange} type="button">
                    &#x25BC;
                </button>
            )}
        </div>
    </header>
);
