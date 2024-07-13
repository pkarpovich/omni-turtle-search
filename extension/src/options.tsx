import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import { Options } from "./components/Options.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Options />
    </React.StrictMode>,
);
