import styles from "./TurtleFootprints.module.css";

export const TurtleFootprints = () => (
    <div className={styles.footprintsContainer}>
        <div className={`${styles.footprint} ${styles.right}`} />
        <div className={`${styles.footprint} ${styles.left}`} />
        <div className={`${styles.footprint} ${styles.right}`} />
        <div className={`${styles.footprint} ${styles.left}`} />
        <div className={`${styles.footprint} ${styles.right}`} />
        <div className={`${styles.footprint} ${styles.left}`} />
        <div className={`${styles.footprint} ${styles.right}`} />
        <div className={`${styles.footprint} ${styles.left}`} />
    </div>
);
