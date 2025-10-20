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
    sourcemap: false,
    minify: 'esbuild',
    target: 'esnext',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core': ['three'],
          'three-react': ['@react-three/fiber', '@react-three/drei'],
          'wallet': ['@rainbow-me/rainbowkit', 'wagmi', 'viem'],
          'wormhole': ['@wormhole-foundation/sdk', '@wormhole-foundation/wormhole-connect']
        }
      },
      onwarn(warning, warn) {
        if (warning.code === 'INVALID_ANNOTATION' || warning.code === 'UNRESOLVED_IMPORT') {
          return;
        }
        warn(warning);
      }
    }
  }
}));
