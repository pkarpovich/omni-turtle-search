import styles from "./LoadingState.module.css";
import { TurtleFootprints } from "./TurtleFootprints.tsx";

const turtleWisdomQuotes = [
    "Turning shells upside down...",
    "Hang tight, turtles don’t rush greatness!",
    "Slow Wi-Fi or just turtle precision?",
    "Un-shelling secrets from the deep web...",
    "Turtle mode activated. Patience recommended.",
    "Hold your shells! Something cool incoming...",
    "Almost there... just turtle seconds away!",
    "Carefully crafting turtle-approved results...",
    "Good results come to those who crawl...",
    "Loading at optimal turtle velocity...",
    "The turtle is buffering, please wait...",
    "Shell-checking the internet for you...",
    "It's not slow, it's turtle-optimized!",
    "Navigating with turtle GPS, patience required...",
    "Slow searches, fast results... eventually!",
    "Just doing a quick turtle sprint...",
    "Powered by lettuce and determination...",
    "Fetching results at maximum turtle speed...",
    "Slow is the new fast, didn't you hear?",
    "Loading like a pro—turtle style!",
];

const randomTurtleWisdom = turtleWisdomQuotes[Math.floor(Math.random() * turtleWisdomQuotes.length)];

export const LoadingState = () => (
    <div className={styles.loadingWrapper}>
        <div className={styles.quoteWrapper}>
            <p className={styles.turtleQuote}>{randomTurtleWisdom}</p>
        </div>
        <TurtleFootprints />
    </div>
);
