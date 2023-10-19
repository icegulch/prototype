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

  eleventyConfig.addTransform('modifyMarkdownImages', (content, outputPath) => {
    if (outputPath && outputPath.endsWith('.html')) {
      // Define your Cloudinary prefix
      const cloudinaryPrefix = 'https://res.clodinary.com/flagstafffrenzy/image/fetch/f_auto,c_limit,w_800,h_600/';

      // Modify content using markdown-it to add the prefix to image URLs
      content = md.render(content, {
        replaceLink: function(link, env) {
          // Check if the link is an image and modify it with the Cloudinary prefix
          if (env.links[link]) {
            return cloudinaryPrefix + env.links[link];
          }
          return link;
        }
      });
    }

    return content;
  });

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};
