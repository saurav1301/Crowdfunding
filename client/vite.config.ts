const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react");
const rollupNodePolyfills = require("rollup-plugin-node-polyfills");
const { NodeGlobalsPolyfillPlugin } = require("@esbuild-plugins/node-globals-polyfill");

module.exports = defineConfig({
  plugins: [
    react(),
    rollupNodePolyfills(),
  ],
  resolve: {
    alias: {
      buffer: "buffer",
      crypto: "crypto-browserify",
      stream: "stream-browserify",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
      ],
    },
  },
});