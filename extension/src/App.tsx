import styles from "./App.module.css";
import { Header } from "./components/Header.tsx";
import { SearchResultItem } from "./components/SearchResultItem.tsx";
import { useQuerySearch } from "./hooks/useQuerySearch.ts";
import { useSearch } from "./hooks/useSearch.ts";

export const App = () => {
    const query = useQuerySearch();
    const { isLoading, data } = useSearch(query);

    return (
        <div className={styles.container}>
            <Header itemsLength={data.length} isLoading={isLoading} />
            <div>
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
            </div>
        </div>
    );
};
