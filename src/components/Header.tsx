import { type SearchProviderStatus } from "../hooks/useSearch.ts";
import { DotType } from "../types/dotType.ts";
import { Dot } from "./Dot.tsx";
import styles from "./Header.module.css";
import { Logo } from "./Logo.tsx";

type Props = {
    onToggleProviderVisibility: (provider: DotType) => void;
    providersStatus: SearchProviderStatus;
    onCollapseChange: () => void;
    hiddenProviders: DotType[];
    isStandalone: boolean;
    isCollapsed: boolean;
    itemsLength: number;
    isLoading: boolean;
    query: string;
};

export const Header = ({
    onToggleProviderVisibility,
    onCollapseChange,
    providersStatus,
    hiddenProviders,
    isStandalone,
    itemsLength,
    isCollapsed,
    isLoading,
    query,
}: Props) => {
    const getHeaderText = () => {
        if (!query) {
            return "Omni Search";
        }
        if (isLoading) {
            return "Searching...";
        }
        if (itemsLength === 0) {
            return "No results found";
        }
        return `Omni Search ${itemsLength > 0 ? `(${itemsLength})` : ""}`;
    };

    return (
        <header className={styles.header}>
            <div className={styles.dotsContainer}>
                <Dot
                    unfilled={hiddenProviders.includes(DotType.cubox)}
                    loading={providersStatus.cubox.isLoading}
                    length={providersStatus.cubox.length}
                    onClick={onToggleProviderVisibility}
                    error={providersStatus.cubox.error}
                    type={DotType.cubox}
                />
                <Dot
                    unfilled={hiddenProviders.includes(DotType.logseq)}
                    loading={providersStatus.logseq.isLoading}
                    length={providersStatus.logseq.length}
                    error={providersStatus.logseq.error}
                    onClick={onToggleProviderVisibility}
                    type={DotType.logseq}
                />
            </div>
            <div className={styles.text}>{getHeaderText()}</div>
            <div className={styles.actionsContainer}>
                <Logo />
                {!isStandalone && itemsLength > 0 ? (
                    <div>
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
                ) : null}
            </div>
        </header>
    );
};
