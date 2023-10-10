const util = require("util");

module.exports = function (eleventyConfig) {

  eleventyConfig.addFilter("dump", (obj) => {
    return util.inspect(obj, { showHidden: false, depth: null, colors: false });
  });

  // configure markdown-it (and set it as your markdown processor for consistency)
  const md = require('markdown-it')({
    html: true,
    breaks: true,
    linkify: true,
  });

  eleventyConfig.setLibrary('md', md);

  eleventyConfig.addFilter('markdownify', str => md.render(str));

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};
