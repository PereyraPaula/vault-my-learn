import { compile } from "@mdx-js/mdx";
import { DateTime } from "luxon";
import { unified } from "unified";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

export default function (eleventyConfig) {
  configurePlugins(eleventyConfig);
  configurePassthroughCopy(eleventyConfig);
  configureCollections(eleventyConfig);
  configureFilters(eleventyConfig);
  addMDXCompatibility(eleventyConfig);

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
}

// Configuración de plugins
function configurePlugins(eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight, {
    template: ({ content, language }) => `
      <div class="code-wrapper">
        <pre class="language-${language}">
          <code>${content}</code>
        </pre>
      </div>
    `,
  });
}

// Configuración de archivos estáticos
function configurePassthroughCopy(eleventyConfig) {
  const assets = ["css", "js", "fonts", "img"];
  assets.forEach((asset) => {
    eleventyConfig.addPassthroughCopy({ [`src/assets/${asset}`]: `assets/${asset}` });
  });
}

// Configuración de colecciones
function configureCollections(eleventyConfig) {
  eleventyConfig.addCollection("categories", (collectionApi) => {
    const categories = new Set();
    collectionApi.getAll().forEach((item) => {
      if (item.data.tags) {
        item.data.tags.forEach((tag) => {
          if (tag !== "posts") categories.add(tag);
        });
      }
    });
    return [...categories];
  });
}

// Configuración de filtros
function configureFilters(eleventyConfig) {
  eleventyConfig.addFilter("fecha", (dateObj, formato = "dd LLL yyyy") => {
    const date = DateTime.fromJSDate(dateObj, { zone: "utc" });
    return formato === "localString" ? date.toLocaleString() : date.toFormat(formato);
  });

  eleventyConfig.addFilter("yearCopyright", (startYear) => {
    const currentYear = new Date().getFullYear();
    return parseInt(startYear) === currentYear
      ? `${currentYear}`
      : `${startYear}–${currentYear}`;
  });
}

// Compatibilidad con MDX
function addMDXCompatibility(eleventyConfig) {
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
}