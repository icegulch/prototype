exports.handler = async (event) => {
  try {
    const fetch = require('node-fetch');
    
    // Extract form submission data
    const submissionData = JSON.parse(event.body).payload;
    const id = submissionData.id;
    const timestamp = submissionData.created_at;
    const author = submissionData.form_name;
    const message = submissionData.data.message;

    const markdownContent = `---
id: ${id}
created_at: ${timestamp}
author: ${author}
---

${message}
`;

    // GitHub repository information
    const repoOwner = "icegulch";
    const repoName = "prototype";
    const folderPath = "src/content/posts/";
    const githubToken = process.env.GITHUB_TOKEN;
    
    const modifiedTimestamp = timestamp.replace(/[:.]/g, "-");
    const filename = `${modifiedTimestamp}-${author}.md`;
    
    // Encode the Markdown content
    const content = Buffer.from(markdownContent).toString("base64");

    // Update the individual Markdown file on GitHub
    const updateResponse = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}/${filename}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Adding new post ${filename}`,
          content: content,
          sha: null, // Pass null to create a new file
        }),
      }
    );

    if (!updateResponse.ok) {
      throw new Error("Failed to update content on GitHub");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Form submitted and individual Markdown file updated",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
