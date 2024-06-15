export const useQuerySearch = (): string => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("q");

    return query ?? "";
};
