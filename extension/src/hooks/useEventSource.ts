import { EventSource, type EventSourceOptions } from "extended-eventsource";
import { useEffect, useState } from "react";

const DefaultOptions = {};

export type AppEventSourceOptions = EventSourceOptions;

type Response<T> = {
    events: Map<string, T>;
    isLoading: boolean;
};

export const useEventSource = <T>(
    url: string,
    query: string,
    options: AppEventSourceOptions = DefaultOptions,
): Response<T> => {
    const [events, setEvents] = useState<Map<string, T>>(new Map<string, T>());
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!query) {
            return;
        }

        setEvents(new Map<string, T>());
        setIsLoading(true);

        const eventSource = new EventSource(url, options);
        eventSource.onmessage = (event) => {
            const { hasMore, data } = JSON.parse(event.data);
            if (!hasMore) {
                eventSource.close();
                setIsLoading(false);
                return;
            }

            setEvents((prevEvents) => new Map([...prevEvents, [data.providerName, data]]));
        };
        eventSource.onerror = (event) => {
            console.error("EventSource error", event);
            eventSource.close();
        };

        return () => {
            if (eventSource.readyState === eventSource.CLOSED) {
                return;
            }

            eventSource.close();
        };
    }, [url, options, query]);

    return { isLoading, events };
};
