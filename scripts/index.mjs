import xml from "xml";
import { writeFile } from "fs";
import { promisify } from "util";
import path from "path";
const writeFileAsync = promisify(writeFile);

const URL = import.meta.env.VITE_API_URL;
async function main() {
    const curDirName = path.resolve(path.dirname(""));
    const publicDir = path.resolve(curDirName, "public/");

    const pages = [
        {
            created: "Feb 02 2021",
            lastModified: "Feb 02 2021",
            slug: "loans",
        },
        {
            created: "Feb 02 2021",
            lastModified: "Feb 02 2021",
            slug: "business-management",
        },
        {
            created: "Feb 02 2021",
            lastModified: "Feb 02 2021",
            slug: "faq",
        },
        {
            created: "Feb 02 2021",
            lastModified: "Feb 02 2021",
            slug: "register",
        },
    ];

    const indexItem = {
        url: [
            {
                loc: URL,
            },
            {
                lastmod: new Date(
                    Math.max.apply(
                        null,
                        pages.map((page) => {
                            return new Date(page.created);
                        })
                    )
                )
                    .toISOString()
                    .split("T")[0],
            },
            { changefreq: "monthly" },
            { priority: "0.8" },
        ],
    };

    const sitemapItems = pages.reduce(function (items, item) {
        // build page items
        items.push({
            url: [
                {
                    loc: `${URL}/${item.slug}`,
                },
                {
                    lastmod: new Date(item.lastModified)
                        .toISOString()
                        .split("T")[0],
                },
            ],
        });
        return items;
    }, []);

    const sitemapObject = {
        urlset: [
            {
                _attr: {
                    xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
                },
            },
            indexItem,
            ...sitemapItems,
        ],
    };

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>${xml(
        sitemapObject
    )}`;

    await writeFileAsync(`${publicDir}/sitemap.xml`, sitemap, "utf8");
}

main();
