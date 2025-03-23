import styles from "./ConnectionError.module.css";

type Props = {
    error: Error;
};

export const ConnectionError = ({ error }: Props) => (
    <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>🚧</div>
        <h3 className={styles.errorTitle}>Oops! Our turtle hit a roadblock</h3>
        <p className={styles.errorDescription}>
            {error.message || "There was a problem connecting to the search service."}
        </p>
    </div>
);
