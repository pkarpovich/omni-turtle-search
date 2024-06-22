import { type SearchProviderStatus } from "../hooks/useSearch.ts";
import { Dot, DotType } from "./Dot.tsx";
import styles from "./Header.module.css";
import { Logo } from "./Logo.tsx";

type Props = {
    onToggleProviderVisibility: (provider: DotType) => void;
    providersStatus: SearchProviderStatus;
    onCollapseChange: () => void;
    hiddenProviders: DotType[];
    isCollapsed: boolean;
    itemsLength: number;
    isLoading: boolean;
};

export const Header = ({
    onToggleProviderVisibility,
    onCollapseChange,
    providersStatus,
    hiddenProviders,
    itemsLength,
    isCollapsed,
    isLoading,
}: Props) => (
    <header className={styles.header}>
        <div>
            <Dot
                unfilled={hiddenProviders.includes(DotType.cubox)}
                onClick={onToggleProviderVisibility}
                error={!providersStatus.cubox}
                type={DotType.cubox}
                loading={isLoading}
            />
            <Dot
                unfilled={hiddenProviders.includes(DotType.logseq)}
                onClick={onToggleProviderVisibility}
                error={!providersStatus.logseq}
                type={DotType.logseq}
                loading={isLoading}
            />
            <Dot
                unfilled={hiddenProviders.includes(DotType.todoist)}
                onClick={onToggleProviderVisibility}
                error={!providersStatus.todoist}
                type={DotType.todoist}
                loading={isLoading}
            />
            <Dot
                unfilled={hiddenProviders.includes(DotType.notion)}
                onClick={onToggleProviderVisibility}
                error={!providersStatus.notion}
                type={DotType.notion}
                loading={isLoading}
            />
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
