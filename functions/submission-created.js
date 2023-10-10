exports.handler = async (event) => {
  try {
    // Extract form submission data
    const submissionData = JSON.parse(event.body).payload.data;

    // Prepare the simplified data
    const simplifiedData = {
      id: submissionData.id,
      created_at: submissionData.created_at,
      url: submissionData.url,
      title: submissionData.title,
      message: submissionData.message,
    };

    // GitHub repository information
    const repoOwner = 'icegulch';
    const repoName = 'prototype';
    const filePath = 'src/_data/posts.json';

    // Fetch the GitHub PAT from Netlify environment variables
    const githubToken = process.env.GITHUB_TOKEN;

    // Fetch the existing posts.json content
    const fetch = await import('node-fetch');
    const response = await fetch.default(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${githubToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch existing content');
    }

    const existingContent = await response.json();

    // Decode the existing content and add the new data
    const decodedContent = JSON.parse(
      Buffer.from(existingContent.content, 'base64').toString('utf-8')
    );

    decodedContent.push(simplifiedData);

    // Encode the modified content back to base64
    const updatedContent = Buffer.from(
      JSON.stringify(decodedContent, null, 2),
      'utf-8'
    ).toString('base64');

    // Update the posts.json file on GitHub
    const updateResponse = await fetch.default(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${githubToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Update posts.json',
          content: updatedContent,
          sha: existingContent.sha,
        }),
      }
    );

    if (!updateResponse.ok) {
      throw new Error('Failed to update content on GitHub');
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
