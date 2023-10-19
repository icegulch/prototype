const util = require("util");

module.exports = function (eleventyConfig) {

  // configure markdown-it (and set it as your markdown processor for consistency)
  const md = require('markdown-it')({
    html: true,
    breaks: true,
    linkify: true,
  });

  eleventyConfig.setLibrary('md', md);
  eleventyConfig.addFilter('markdownify', str => md.render(str));

  const cloudinaryPrefix = 'https://res.cloudinary.com/flagstafffrenzy/image/fetch/f_auto/c_limit,w_1000,h_800,g_center/';

  // Define the custom filter within your 11ty config
  eleventyConfig.addFilter('prependCloudinaryURL', function(content) {
    // Use a regular expression to search and modify image src attributes
    const modifiedContent = content.replace(/<img src="([^"]+)"/g, (match, src) => {
      return `<img src="${cloudinaryPrefix}${src}" loading="lazy"`;
    });

    return modifiedContent;
  });

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};
