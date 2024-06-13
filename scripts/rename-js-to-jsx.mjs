import { readdir, stat, rename } from "fs/promises";
import { join } from "path";

async function renameJsToJsx(componentsPath) {
    try {
        // Read the contents of the components directory
        const subfolders = await readdir(componentsPath);

        // Iterate over each subfolder
        await Promise.all(
            subfolders.map(async (subfolder) => {
                const subfolderPath = join(componentsPath, subfolder);

                // Check if it's a directory
                const stats = await stat(subfolderPath);
                if (stats.isDirectory()) {
                    // Read the contents of the subfolder
                    const files = await readdir(subfolderPath);

                    // Filter out only the .js files
                    const jsFiles = files.filter((file) =>
                        file.endsWith(".js")
                    );

                    // Rename each .js file to .jsx
                    await Promise.all(
                        jsFiles.map(async (jsFile) => {
                            const oldFilePath = join(subfolderPath, jsFile);
                            const newFilePath = join(
                                subfolderPath,
                                jsFile.replace(".js", ".jsx")
                            );

                            await rename(oldFilePath, newFilePath);
                            console.log(
                                `Renamed: ${jsFile} to ${jsFile.replace(
                                    ".js",
                                    ".jsx"
                                )}`
                            );
                        })
                    );
                }
            })
        );

        console.log(
            `All .js files in subfolders of "${componentsPath}" have been renamed to .jsx`
        );
    } catch (error) {
        console.error("Error:", error.message);
    }
}

renameJsToJsx("resources/js/pages/business-management/components/");
