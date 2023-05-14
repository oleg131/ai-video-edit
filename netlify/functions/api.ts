import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

const { Configuration, OpenAIApi } = require('openai');
const apiKey = process.env.OPENAI_APIKEY;

if (!apiKey) {
	throw Error('No OpenAI api key');
}

const configuration = new Configuration({
	apiKey: apiKey
});
const openai = new OpenAIApi(configuration);

async function ask({ prompt }) {
	console.log(prompt);

	const response = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		temperature: 0.2,
		messages: [{ role: 'user', content: prompt }]
	});

	return response.data.choices;
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
	// const res = process(JSON.parse(event.body))

	// return {
	//     statusCode: 200,
	//     body: JSON.stringify(res),
	//     headers: {
	//         "Content-Type": "application/json; charset=utf-8",
	//     },
	// };

	const data = JSON.parse(event.body).data;

	// const data = req.body.data.trim();

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
		if (!command.startsWith('ffmpeg ')) {
			throw Error("Command doesn't start with ffmpeg");
		}
		const description = matches[2].trim();

		return {
			statusCode: 200,
			body: JSON.stringify({ command, description }),
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			}
		};
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export { handler };
