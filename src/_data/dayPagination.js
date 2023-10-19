module.exports = function () {
  const posts = require('./posts.js');

  // Group posts by day
  const postsByDay = {};

  posts.forEach((post) => {
    const day = post.created_at.split('T')[0];
    if (!postsByDay[day]) {
      postsByDay[day] = [];
    }
    postsByDay[day].push(post);
  });

  // Create an array of day-based pagination data
  const dayPagination = Object.keys(postsByDay).map((day) => {
    return {
      day: day,
      posts: postsByDay[day],
    };
  });

  return dayPagination;
};
