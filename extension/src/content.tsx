// eslint-disable-next-line filename-rules/match
import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App.tsx";

const containers = document.getElementsByClassName("right-content-box");
if (!containers.length) {
    console.warn("No containers found");
}

const container = containers[0];
const root = document.createElement("div");
root.id = "crx-root";
container.prepend(root);

ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
