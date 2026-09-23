export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({
      message: 'Method not allowed'
    });
  }

  try {

    const { whatsapp } = req.body;

    const GITHUB_USERNAME = 'bizmedia1';
    const REPO_NAME = 'cta-control';
    const FILE_PATH = 'config.json';

    const TOKEN = process.env.GITHUB_TOKEN;

    // GET CURRENT FILE
    const currentFile = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );

    const fileData = await currentFile.json();

    // NEW CONTENT
    const updatedContent = {
      whatsapp
    };

    // ENCODE
    const encodedContent = Buffer.from(
      JSON.stringify(updatedContent, null, 2)
    ).toString('base64');

    // UPDATE FILE
    const update = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`
        },
        body: JSON.stringify({
          message: 'Updated WhatsApp link',
          content: encodedContent,
          sha: fileData.sha
        })
      }
    );

    if (update.ok) {

      return res.status(200).json({
        success: true
      });

    } else {

      const error = await update.json();

      return res.status(400).json(error);

    }

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }

}
