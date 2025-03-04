import { useCallback, useEffect, useState } from "react";

type StoreProvider = {
    get<T>(key: string, defaultValue?: T): Promise<T>;
    set<T>(key: string, value: T): Promise<T>;
};

const chromeStorage: StoreProvider = {
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

const localStorage: StoreProvider = {
    get: <T>(key: string, defaultValue?: T) => {
        const value = window.localStorage.getItem(key);
        if (value === null) {
            return Promise.resolve(defaultValue);
        }
        return Promise.resolve(JSON.parse(value));
    },
    set: <T>(key: string, value: T) => {
        window.localStorage.setItem(key, JSON.stringify(value));
        return Promise.resolve(value);
    },
};

const isExtension = typeof chrome !== "undefined" && chrome.storage;

const storeProvider = isExtension ? chromeStorage : localStorage;

export const useStorage = <T>(key: string, defaultValue: T) => {
    const [value, setValue] = useState<T>(defaultValue);

    useEffect(() => {
        storeProvider.get<T>(key, defaultValue).then(setValue).catch(console.error);
    }, [defaultValue, key]);

    const handleSetValue = useCallback(
        (newValue: T) => {
            setValue(() => {
                storeProvider.set(key, newValue).catch(console.error);

                return newValue;
            });
        },
        [key],
    );

    return [value, handleSetValue] as const;
};
