import { useEffect } from "react";

const DEFAULT_OPTIONS = {
    config: {
        attributes: true,
    },
};

export const useMutationObservable = (
    parentEl: Element | string,
    cb: (mutations: MutationRecord[]) => void,
    options = DEFAULT_OPTIONS,
) => {
    const element = typeof parentEl === "string" ? document.querySelector(parentEl) : parentEl;
    useEffect(() => {
        if (!element) {
            return undefined;
        }

        const observer = new MutationObserver(cb);
        const { config } = options;
        observer.observe(element, config);

        return () => observer.disconnect();
    }, [cb, element, options]);
};
