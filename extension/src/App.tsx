import { useCallback, useState } from "react";

import styles from "./App.module.css";
import { Header } from "./components/Header.tsx";
import { SearchResultItem } from "./components/SearchResultItem.tsx";
import { useChromeStorage } from "./hooks/useChromeStorage.ts";
import { useQuerySearch } from "./hooks/useQuerySearch.ts";
import { useSearch } from "./hooks/useSearch.ts";

const CollapseKey = "isCollapsed";

export const App = () => {
    const query = useQuerySearch();
    const { providersStatus, isLoading, data } = useSearch(query);
    const [isCollapsed, setIsCollapsed] = useChromeStorage<boolean>(CollapseKey, false);

    const handleToggleCollapse = useCallback(() => {
        setIsCollapsed((prev) => !prev);
    }, []);

    return (
        <div className={styles.container}>
            <Header
                onCollapseChange={handleToggleCollapse}
                providersStatus={providersStatus}
                isCollapsed={isCollapsed}
                itemsLength={data.length}
                isLoading={isLoading}
            />
            {!isCollapsed ? (
                <ul>
                    {data.map(({ description, updateTime, title, url, id }) => (
                        <SearchResultItem
                            description={description}
                            date={updateTime}
                            title={title}
                            url={url}
                            key={id}
                        />
                    ))}
                </ul>
            ) : null}
        </div>
    );
};
