import styles from "./App.module.css";
import { Search } from "./components/Search.tsx";
import { useMetadata } from "./hooks/useMetadata.ts";
import { useQuerySearch } from "./hooks/useQuerySearch.ts";

export const App = () => {
    const query = useQuerySearch();
    const metadata = useMetadata();

    return (
        <div className={styles.container}>
            {metadata ? (
                <Search metadata={metadata} query={query} />
            ) : (
                <div>
                    <p>Set up the extension</p>
                    <p>Go to the options page and set up the extension</p>
                </div>
            )}
        </div>
    );
};
