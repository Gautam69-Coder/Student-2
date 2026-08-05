
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                            return 'react-vendor';
                        }
                        if (id.includes('framer-motion')) {
                            return 'motion';
                        }
                        if (id.includes('lucide-react')) {
                            return 'ui-icons';
                        }
                        if (id.includes('antd')) {
                            return 'antd-vendor';
                        }
                    }
                },
            },
        },
        chunkSizeWarningLimit: 1000,
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'framer-motion', 'lucide-react'],
    },
})
