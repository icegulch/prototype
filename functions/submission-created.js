exports.handler = async (event) => {
  try {

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
    console.log('fucking shit1:', repoOwner);
    const repoName = "prototype";
    const folderPath = "src/content/posts/";
    const githubToken = process.env.GITHUB_TOKEN;
    
    const modifiedTimestamp = timestamp.replace(/[:.]/g, "-");
    const filename = `${modifiedTimestamp}-${author}.md`;
    
    // Encode the Markdown content
    const content = Buffer.from(markdownContent).toString("base64");

    const fetch = await import('node-fetch');
    const addContent = await fetch.default(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}/${filePath}`,
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

    if (!addContent.ok) {
      throw new Error("Failed to add content on GitHub");
    } 

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Form submitted and posts.json updated' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
