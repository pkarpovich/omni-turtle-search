import { useCallback, useEffect, useState } from "react";

export const storage = {
    get: <T>(key: string, defaultValue?: T) => {
        const keyObj = defaultValue === undefined ? key : { [key]: defaultValue };
        return new Promise<T>((resolve, reject) => {
            chrome.storage.sync.get(keyObj, (items) => {
                const error = chrome.runtime.lastError;
                if (error) {
                    return reject(error);
                }
                resolve(items[key]);
            });
        });
    },
    set: <T>(key: string, value: T) =>
        new Promise<T>((resolve, reject) => {
            chrome.storage.sync.set({ [key]: value }, () => {
                const error = chrome.runtime.lastError;
                error ? reject(error) : resolve(value);
            });
        }),
};

export const useChromeStorage = <T>(key: string, defaultValue: T) => {
    const [value, setValue] = useState<T>(defaultValue);

    useEffect(() => {
        storage.get<T>(key, defaultValue).then(setValue).catch(console.error);
    }, [key]);

    const handleSetValue = useCallback(
        (newValue: ((prevValue: T) => T) | T) => {
            setValue((prevValue) => {
                const valueToStore =
                    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                    typeof newValue === "function" ? (newValue as (prevValue: T) => T)(prevValue) : newValue;
                storage.set(key, valueToStore).catch(console.error);
                return valueToStore;
            });
        },
        [key],
    );

    return [value, handleSetValue] as const;
};
