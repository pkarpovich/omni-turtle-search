import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

import { SearchItem } from "../types/searchItem.ts";
import { SearchResultItem } from "./SearchResultItem.tsx";

const MaxHeight = 600;
const RowHeight = 130;
const Gap = 20;

type Props = {
    isStandalone: boolean;
    data: SearchItem[];
};

export const SearchList = ({ isStandalone, data }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        getScrollElement: () => containerRef.current,
        estimateSize: () => RowHeight,
        count: data.length,
        gap: Gap,
    });

    const needsBorder = !isStandalone && virtualizer.getTotalSize() > MaxHeight;

    return (
        <div
            style={{
                borderBottom: needsBorder ? "1px solid var(--primary-200)" : "none",
                maxHeight: isStandalone ? "calc(100vh - 160px)" : `${MaxHeight}px`,
                padding: "0 10px 10px 10px",
                boxSizing: "content-box",
                overflowY: "auto",
            }}
            ref={containerRef}
        >
            <ul
                style={{
                    height: virtualizer.getTotalSize(),
                    position: "relative",
                    width: "100%",
                }}
            >
                {virtualizer.getVirtualItems().map((virtualItem) => (
                    <li
                        style={{
                            transform: `translateY(${virtualItem.start}px)`,
                            position: "absolute",
                            width: "100%",
                        }}
                        ref={virtualItem.measureElement}
                        data-index={virtualItem.index}
                        key={virtualItem.key}
                    >
                        <SearchResultItem
                            providerName={data[virtualItem.index].providerName}
                            description={data[virtualItem.index].description}
                            date={data[virtualItem.index].updateTime}
                            title={data[virtualItem.index].title}
                            url={data[virtualItem.index].url}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};
