import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const cesium = require("vite-plugin-cesium").default;

export default defineConfig({
    plugins: [react(), cesium()],
});
