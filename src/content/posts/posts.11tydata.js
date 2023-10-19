module.exports = {
  tags: "posts",
  permalink: false,
  eleventyComputed: {
    just_the_date: (data) => {
      // Ensure data.created_at is a Date object
      if (data.created_at instanceof Date) {
        return data.created_at.toISOString().split('T')[0];
      }

      // If data.created_at is not a Date object, attempt to parse it
      const date = new Date(data.created_at);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }

      // If parsing fails, return the original value
      return data.created_at.toString();
    },
  },
};
