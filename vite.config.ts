import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension from "vite-plugin-web-extension";
import svgr from "vite-plugin-svgr";

const isExtensionBuild = process.env.BUILD_TARGET === "extension";

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        outDir: isExtensionBuild ? "dist-extension" : "dist-web",
    },
    plugins: [
        react(),
        svgr({ include: "**/*.svg" }),
        isExtensionBuild &&
            webExtension({
                disableAutoLaunch: true,
            }),
    ].filter(Boolean),
});
