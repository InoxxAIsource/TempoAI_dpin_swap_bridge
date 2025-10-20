import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false, // Disable sourcemaps to reduce memory usage
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split large vendor libraries into separate chunks
          'three': ['three'],
          'react-three': ['@react-three/fiber', '@react-three/drei'],
          'wallet-libs': ['@rainbow-me/rainbowkit', 'wagmi', 'viem'],
          'solana': ['@solana/wallet-adapter-react', '@solana/wallet-adapter-react-ui', '@solana/web3.js'],
          'wormhole': ['@wormhole-foundation/wormhole-connect', '@wormhole-foundation/sdk'],
        },
      },
      onwarn(warning, warn) {
        // Suppress warnings about comments in node_modules
        if (warning.code === 'INVALID_ANNOTATION' && warning.message.includes('/*#__PURE__*/')) {
          return;
        }
        // Suppress module externalization warnings
        if (warning.code === 'UNRESOLVED_IMPORT' && warning.message.includes('externalized for browser compatibility')) {
          return;
        }
        warn(warning);
      }
    }
  }
}));
