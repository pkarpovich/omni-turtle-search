import { useDeferredValue } from "react";

import styles from "./App.module.css";
import { ExtensionSetupPrompt } from "./components/ExtensionSetupPrompt.tsx";
import { Search } from "./components/Search.tsx";
import { useMetadata } from "./hooks/useMetadata.ts";
import { useQuerySearch } from "./hooks/useQuerySearch.ts";

type Props = {
    isStandalone?: boolean;
};

export const App = ({ isStandalone = false }: Props) => {
    const [query, setQuery] = useQuerySearch();
    const deferredQuery = useDeferredValue(query);
    const metadata = useMetadata();

    return (
        <div className={isStandalone ? styles.standaloneContainer : styles.container}>
            {metadata ? (
                <Search isStandalone={isStandalone} query={deferredQuery} onChange={setQuery} metadata={metadata} />
            ) : (
                <ExtensionSetupPrompt isStandalone={isStandalone} />
            )}
        </div>
    );
};
