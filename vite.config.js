// import react from "@vitejs/plugin-react";
import laravel from 'laravel-vite-plugin';

export default ({ command }) => ({
    base: command === 'serve' ? '' : '/build/',
    publicDir: 'fake_dir_so_nothing_gets_copied',
    build: {
        manifest: true,
        outDir: 'public/build',
        rollupOptions: {
            input: 'resources/js/main.js',
        },
    },
    plugins: [
        laravel({
            input: ['resources/js/main.js'],
            refresh: true,
        }),
        // react({ include: "**/*.jsx" }),
    ],
});
