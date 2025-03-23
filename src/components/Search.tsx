import { useCallback } from "react";

import { useSearch } from "../hooks/useSearch.ts";
import { useStorage } from "../hooks/useStorage.ts";
import { type Metadata } from "../types/metadata.ts";
import { ConnectionError } from "./ConnectionError.tsx";
import { EmptyState } from "./EmptyState.tsx";
import { Header } from "./Header.tsx";
import { Input } from "./Input.tsx";
import { LoadingState } from "./LoadingState.tsx";
import { SearchList } from "./SearchList.tsx";

const CollapseKey = "isCollapsed";

type Props = {
    onChange: (query: string) => void;
    isStandalone: boolean;
    metadata: Metadata;
    query: string;
};

export const Search = ({ isStandalone, metadata, onChange, query }: Props) => {
    const { toggleProviderVisibility, providersStatus, hiddenProviders, connectionError, isLoading, data } = useSearch(
        metadata.url,
        query,
    );
    const [isCollapsed, setIsCollapsed] = useStorage<boolean>(CollapseKey, false);

    const handleToggleCollapse = useCallback(() => {
        setIsCollapsed(!isCollapsed);
    }, [isCollapsed, setIsCollapsed]);

    const renderContent = () => {
        if (!query) {
            return null;
        }

        if (isLoading && data.length === 0) {
            return <LoadingState />;
        }

        if (data.length === 0 && !isCollapsed) {
            return <EmptyState query={query} />;
        }

        if (!isCollapsed && data.length) {
            return <SearchList isStandalone={isStandalone} data={data} />;
        }

        return null;
    };

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
            {connectionError ? <ConnectionError error={connectionError} /> : null}
            {renderContent()}
        </>
    );
};
