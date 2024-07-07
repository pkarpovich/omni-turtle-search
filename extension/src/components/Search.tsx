import { useCallback } from "react";

import { useChromeStorage } from "../hooks/useChromeStorage.ts";
import { useSearch } from "../hooks/useSearch.ts";
import { type Metadata } from "../types/metadata.ts";
import { Header } from "./Header.tsx";
import { SearchResultItem } from "./SearchResultItem.tsx";

const CollapseKey = "isCollapsed";

type Props = {
    metadata: Metadata;
    query: string;
};

export const Search = ({ metadata, query }: Props) => {
    const { toggleProviderVisibility, providersStatus, hiddenProviders, isLoading, data } = useSearch(query, metadata);
    const [isCollapsed, setIsCollapsed] = useChromeStorage<boolean>(CollapseKey, false);

    const handleToggleCollapse = useCallback(() => {
        setIsCollapsed((prev) => !prev);
    }, []);

    return (
        <>
            <Header
                onToggleProviderVisibility={toggleProviderVisibility}
                onCollapseChange={handleToggleCollapse}
                providersStatus={providersStatus}
                hiddenProviders={hiddenProviders}
                isCollapsed={isCollapsed}
                itemsLength={data.length}
                isLoading={isLoading}
            />
            {!isCollapsed ? (
                <ul>
                    {data.map(({ providerName, description, updateTime, title, url, id }) => (
                        <SearchResultItem
                            providerName={providerName}
                            description={description}
                            date={updateTime}
                            title={title}
                            url={url}
                            key={id}
                        />
                    ))}
                </ul>
            ) : null}
        </>
    );
};
