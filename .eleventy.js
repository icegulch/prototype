const util = require("util");
const { format, startOfDay } = require('date-fns');

module.exports = function (eleventyConfig) {

  eleventyConfig.addFilter('console', function(value) {
      return util.inspect(value);
  });
  
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

  eleventyConfig.addCollection('dayPagination', function(collection) {
    const posts = collection.getFilteredByGlob('./src/content/posts/*.md'); // Adjust the glob pattern to match your file structure

    // Group posts by day
    const dayPagination = {};

    posts.forEach((post) => {
      const postDate = startOfDay(new Date(post.data.created_at));
      const day = format(postDate, 'yyyy-MM-dd');

      if (!dayPagination[day]) {
        dayPagination[day] = [];
      }

      dayPagination[day].push(post);
    });

    // Sort the dayPagination keys (days) in descending order
    const sortedDays = Object.keys(dayPagination).sort((a, b) => new Date(b) - new Date(a));

    const sortedDayPagination = {};

    // Reconstruct the sorted dayPagination
    sortedDays.forEach((day) => {
      sortedDayPagination[day] = dayPagination[day];
    });

    return sortedDayPagination;
  });

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};
