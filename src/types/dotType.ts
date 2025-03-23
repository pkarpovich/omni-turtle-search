export enum DotType {
    logseq = "logseq",
    cubox = "cubox",
}

export const isDotType = (value: string): value is keyof typeof DotType => Object.keys(DotType).includes(value);
