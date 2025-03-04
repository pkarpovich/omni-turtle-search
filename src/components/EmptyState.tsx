import { useMemo } from "react";

import styles from "./EmptyState.module.css";

const turtleTips = [
    "Tip: Broader searches might lure out hidden turtles.",
    "Tip: Double-check spelling—turtles are sticklers for details!",
    "Tip: Shorter keywords help turtles search faster.",
    "Tip: Give the turtle simpler clues to follow.",
    "Tip: Less specific queries bring better turtle luck.",
];

const randomTurtleTip = turtleTips[Math.floor(Math.random() * turtleTips.length)];

type Props = {
    query: string;
};

export const EmptyState = ({ query }: Props) => {
    const message = useMemo<string>(() => {
        const messages = [
            `Looks like "${query}" swam away from our turtle radar.`,
            `Our turtle took a wrong turn searching for "${query}".`,
            `Turtle power exhausted! Nothing found for "${query}".`,
            `Shell-empty results for "${query}". Check your spelling?`,
            `"${query}" seems faster than our turtle's search skills.`,
            `The turtle says "${query}" might be hiding. Try again later!`,
            `Oops! "${query}" is too quick for our turtle.`,
            `"${query}" not found. Our turtle detective demands a new clue!`,
            `Our turtle's crystal shell couldn't see "${query}".`,
            `No luck finding "${query}". Even turtles shrug sometimes.`,
        ];

        return messages[Math.floor(Math.random() * messages.length)];
    }, [query]);

    return (
        <div className={styles.emptyStateWrapper}>
            <div className={styles.emptyMessageWrapper}>
                <p className={styles.turtleEmptyMessage}>{message}</p>
                <p className={styles.turtleTip}>{randomTurtleTip}</p>
            </div>
        </div>
    );
};
