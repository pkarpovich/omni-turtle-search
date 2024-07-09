import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useRef } from "react";

import { useChromeStorage } from "../hooks/useChromeStorage.ts";
import { useSearch } from "../hooks/useSearch.ts";
import { type Metadata } from "../types/metadata.ts";
import { Header } from "./Header.tsx";
import { SearchList } from "./SearchList.tsx";
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
            {!isCollapsed && data.length ? <SearchList data={data} /> : null}
        </>
    );
};
