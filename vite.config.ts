import { fileURLToPath, URL } from "node:url";
import { VitePluginFonts } from "vite-plugin-fonts";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePluginFonts({
      google: {
        families: [
          {
            name: "Manrope",
            styles: "wght@400;500;600;700",
          },
        ],
      },
    }),
    svgLoader(),
  ],
  build: {
    target: "esnext", // you can also use 'es2020' here
    rollupOptions: {
      external: ["@trezor/connect-common/src/messageChannel/abstract"],
    },
  },
  optimizeDeps: {
    exclude: ["@trezor/connect-common/src/messageChannel/abstract"],
    esbuildOptions: {
      target: "esnext", // you can also use 'es2020' here
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/scss/variables.scss";`,
      },
    },
  },
});
