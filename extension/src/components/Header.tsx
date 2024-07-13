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
}: Props) => (
    <header className={styles.header}>
        <div>
            <Dot
                unfilled={hiddenProviders.includes(DotType.cubox)}
                loading={providersStatus.cubox.isLoading}
                onClick={onToggleProviderVisibility}
                error={providersStatus.cubox.error}
                type={DotType.cubox}
            />
            <Dot
                unfilled={hiddenProviders.includes(DotType.logseq)}
                loading={providersStatus.logseq.isLoading}
                error={providersStatus.logseq.error}
                onClick={onToggleProviderVisibility}
                type={DotType.logseq}
            />
            <Dot
                unfilled={hiddenProviders.includes(DotType.todoist)}
                loading={providersStatus.todoist.isLoading}
                error={providersStatus.todoist.error}
                onClick={onToggleProviderVisibility}
                type={DotType.todoist}
            />
            <Dot
                unfilled={hiddenProviders.includes(DotType.notion)}
                loading={providersStatus.notion.isLoading}
                error={providersStatus.notion.error}
                onClick={onToggleProviderVisibility}
                type={DotType.notion}
            />
        </div>
        <div className={styles.text}>{isLoading ? "Loading..." : itemsLength === 0 ? "No results" : `Omni Search`}</div>
        <div className={styles.actionsContainer}>
            <Logo />
            {!isStandalone ? (
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
