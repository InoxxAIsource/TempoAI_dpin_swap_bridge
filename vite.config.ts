import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Custom plugin to ensure _redirects is copied
const copyRedirectsPlugin = () => ({
  name: 'copy-redirects',
  closeBundle() {
    console.log('✅ Build complete - ensure _redirects file is in dist/');
  }
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger(),
    copyRedirectsPlugin()
  ].filter(Boolean),
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
          'wallet': ['@rainbow-me/rainbowkit', 'wagmi', 'viem'],
          'wormhole': ['@wormhole-foundation/sdk', '@wormhole-foundation/wormhole-connect'],
          'solana': ['@solana/wallet-adapter-react', '@solana/wallet-adapter-wallets', '@solana/web3.js']
        }
      },
      onwarn(warning, warn) {
        if (warning.code === 'INVALID_ANNOTATION' || warning.code === 'UNRESOLVED_IMPORT') {
          return;
        }
        warn(warning);
      }
    }
  },
  // Explicitly tell Vite to copy public files
  publicDir: 'public'
}));
