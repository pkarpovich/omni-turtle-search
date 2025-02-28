import { useCallback } from "react";

import { useSearch } from "../hooks/useSearch.ts";
import { useStorage } from "../hooks/useStorage.ts";
import { type Metadata } from "../types/metadata.ts";
import { Header } from "./Header.tsx";
import { Input } from "./Input.tsx";
import { SearchList } from "./SearchList.tsx";

const CollapseKey = "isCollapsed";

type Props = {
    onChange: (query: string) => void;
    isStandalone: boolean;
    metadata: Metadata;
    query: string;
};

export const Search = ({ isStandalone, metadata, onChange, query }: Props) => {
    const { toggleProviderVisibility, providersStatus, hiddenProviders, isLoading, data } = useSearch(query, metadata);
    const [isCollapsed, setIsCollapsed] = useStorage<boolean>(CollapseKey, false);

    const handleToggleCollapse = useCallback(() => {
        setIsCollapsed(!isCollapsed);
    }, [isCollapsed, setIsCollapsed]);

    return (
        <>
            <Header
                onToggleProviderVisibility={toggleProviderVisibility}
                onCollapseChange={handleToggleCollapse}
                providersStatus={providersStatus}
                hiddenProviders={hiddenProviders}
                isStandalone={isStandalone}
                isCollapsed={isCollapsed}
                itemsLength={data.length}
                isLoading={isLoading}
                query={query}
            />
            {isStandalone ? <Input initialQuery={query} onChange={onChange} /> : null}
            {!isCollapsed && data.length ? <SearchList isStandalone={isStandalone} data={data} /> : null}
        </>
    );
};
