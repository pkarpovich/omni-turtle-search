import { useCallback, useEffect, useState } from "react";

export const useChromeStorage = <T>(key: string, defaultValue: T) => {
    const [value, setValue] = useState<T>(defaultValue);

    useEffect(() => {
        chrome.storage.sync.get(key, (data) => {
            setValue(data[key] ?? defaultValue);
        });
    }, [key, defaultValue]);

    const handleSetValue = useCallback(
        (newValue: ((prevValue: T) => T) | T) => {
            setValue((prevValue) => {
                const valueToStore =
                    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                    typeof newValue === "function" ? (newValue as (prevValue: T) => T)(prevValue) : newValue;
                chrome.storage.sync.set({ [key]: valueToStore }).catch(console.error);
                return valueToStore;
            });
        },
        [key],
    );

    return [value, handleSetValue] as const;
};
