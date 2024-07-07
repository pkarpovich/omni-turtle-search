import styles from "./App.module.css";
import { ExtensionSetupPrompt } from "./components/ExtensionSetupPrompt.tsx";
import { Search } from "./components/Search.tsx";
import { useMetadata } from "./hooks/useMetadata.ts";
import { useQuerySearch } from "./hooks/useQuerySearch.ts";

export const App = () => {
    const query = useQuerySearch();
    const metadata = useMetadata();

    return (
        <div className={styles.container}>
            {metadata ? <Search metadata={metadata} query={query} /> : <ExtensionSetupPrompt />}
        </div>
    );
};
