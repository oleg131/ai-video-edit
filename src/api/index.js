const router = require("express").Router();

const { Configuration, OpenAIApi } = require("openai");
const apiKey = process.env.OPENAI_APIKEY;

const configuration = new Configuration({
  apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);

async function ask({ prompt }) {
  console.log(prompt);

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  return response.data.choices;
}

router.post("/", async (req, res) => {
  console.log(0);

  const data = req.body.data.trim();

  // const prompt = `Write ffmpeg command to: ${data}.
  // Only print the command, nothing else.`;

  const prompt = `Write ffmpeg command to: ${data}. Surround the command with "%%%". What will the resulting output video be?
 `;

  const choices = await ask({ prompt: prompt });

  // const answer = choices[0].message.content;
  // res.status(200).send({ command: answer });

  const answer = choices[0].message.content;

  console.log(answer);

  const matches = answer.match(/.*?%%%(.+?)%%%.*\n(.+)/s);

  try {
    const command = matches[1].trim();
    if (!command.startsWith("ffmpeg ")) {
      throw Error("Command doesn't start with ffmpeg");
    }
    const description = matches[2].trim();

    res.status(200).send({ command, description });
  } catch (error) {
    console.error(error);
    throw error;
  }
});

module.exports = router;
