const openAi = require('openai');

const openAiApiKey = process.env.OPENAI_KEY;

let clientObj;

const model = 'gpt-4o';


function getClient() {
  if (clientObj) return clientObj;
  clientObj = new openAi.OpenAI({ apiKey: openAiApiKey });
  return clientObj;
}

async function getPromptResponse(prompt, responseFormat) {
  console.log('getting prompt response');
  const client = getClient();
  const messages = [
    { role: 'system', content: 'You are a helpful dietician.' },
    { role: 'user', content: prompt },
  ];

  const response = await client.beta.chat.completions.parse({
    messages, model,
    response_format: responseFormat, 
  });


  const { choices } = response;
  const [choice] = choices;
  console.log('prompt response done');
  return JSON.parse(choice.message.content);
}

module.exports = {
  getPromptResponse,
};
