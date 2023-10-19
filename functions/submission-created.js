exports.handler = async (event) => {
  try {

    // Extract form submission data
    const submissionData = JSON.parse(event.body).payload;

    // Prepare the simplified data
    const simplifiedData = {
      id: submissionData.id,
      created_at: submissionData.created_at,
      author: submissionData.form_name,
      message: submissionData.data.message,
    };

    console.log('submmission data: ', submissionData);
// GitHub repository information
    const repoOwner = "icegulch";
    const repoName = "prototype";
    const folderPath = "src/_posts/";
    const githubToken = process.env.GITHUB_TOKEN;
    
    const modifiedTimestamp = timestamp.replace(/[:.]/g, "-");
    const filename = `${modifiedTimestamp}-${author}.json`;
    
    // Encode the content to base64
    const newContent = Buffer.from(
      JSON.stringify(simplifiedData, null, 2),
      'utf-8'
    ).toString('base64');


    const fetch = await import('node-fetch');
    const addContent = await fetch.default(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}${filename}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Adding new post ${filename}`,
          content: newContent,
          sha: null, // Pass null to create a new file
        }),
      }
    );

    if (!addContent.ok) {
      throw new Error("Failed to add content on GitHub");
    } 

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Form submitted and new file added' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
