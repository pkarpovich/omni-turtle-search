import { type DotType } from "../components/Dot.tsx";

export type SearchItem = {
    providerName: DotType;
    description: string;
    updateTime: Date;
    title: string;
    date: string;
    url: string;
    id: string;
};
