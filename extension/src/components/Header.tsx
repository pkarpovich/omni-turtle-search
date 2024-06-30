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
                error={providersStatus.cubox.error}
                type={DotType.cubox}
                loading={isLoading}
            />
            <Dot
                unfilled={hiddenProviders.includes(DotType.logseq)}
                error={providersStatus.logseq.error}
                onClick={onToggleProviderVisibility}
                type={DotType.logseq}
                loading={isLoading}
            />
            <Dot
                unfilled={hiddenProviders.includes(DotType.todoist)}
                error={providersStatus.todoist.error}
                onClick={onToggleProviderVisibility}
                type={DotType.todoist}
                loading={isLoading}
            />
            <Dot
                unfilled={hiddenProviders.includes(DotType.notion)}
                error={providersStatus.notion.error}
                onClick={onToggleProviderVisibility}
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
