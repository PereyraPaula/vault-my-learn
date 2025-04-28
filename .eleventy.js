import { compile } from "@mdx-js/mdx";
import { DateTime } from "luxon";
import { unified } from "unified";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight, {
    template: ({ content, language }) => {
      return `
        <div class="code-wrapper">
          <pre class="language-${language}">
            <code>${content}</code>
          </pre>
        </div>
        `;
    }
  });
  eleventyConfig.addPassthroughCopy({ "src/assets/css": "assets/css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "assets/fonts" });
  eleventyConfig.addPassthroughCopy({ "src/assets/img": "assets/img" });

  eleventyConfig.addCollection("categories", function (collectionApi) {
    const categorias = new Set();
    collectionApi.getAll().forEach(item => {
      if (item.data.tags) {
        item.data.tags.forEach(tag => { if (tag !== 'posts') categorias.add(tag) });
      }
    });
    return [...categorias];
  });

  eleventyConfig.addFilter(
    "fecha",
    function (dateObj, formato = "dd LLL yyyy") {
      if (formato === "localString") return DateTime.fromJSDate(dateObj, { zone: "utc" }).toLocaleString()
      return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(formato);
    }
  );

  eleventyConfig.addFilter("yearCopyright", (startYear) => {
    const currentYear = new Date().getFullYear();
    return (parseInt(startYear) === currentYear)
      ? `${currentYear}`
      : `${startYear}–${currentYear}`;
  });

  addCompatibiltyMDX(eleventyConfig);

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
}

const addCompatibiltyMDX = (eleventyConfig) => {
  // Añadir soporte para .mdx como páginas
  eleventyConfig.addTemplateFormats("mdx");

  eleventyConfig.addExtension("mdx", {
    outputFileExtension: "html",

    compile: async function (inputContent) {
      const compiled = await compile(inputContent, {
        outputFormat: "function-body",
        development: false,
        useDynamicImport: false,
        jsx: true,
        providerImportSource: null,
      });

      const { default: Content } = await import(
        `data:text/javascript,${compiled.value}`
      );

      const html = unified()
        .use(remarkParse)
        .use(Content) // MDX compiled content
        .use(rehypeStringify)
        .processSync(inputContent)
        .toString();

      return async () => html;
    },
  });
};
