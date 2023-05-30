import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const { prompt } = JSON.parse(req.body);
  const shape = {
    title: "Filter cofee",
    ingredients: [
      "1) Milk (300 ml)",
      "2) Sugar (4 tablespoons)",
      "3) Coffee powder (2 tablespoons)",
    ],
    instructions: [
      "1) Boil milk until its warm",
      "2) Add coffee powder once the milk boils",
      "3) Add sugar",
      "4) Pour it in your favourite coffee mug and enjoy!",
    ],
    preperationTime: "5 minutes",
    cookingTime: "15 minutes",
    noOfServings: 1,
  };
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are a michelin star chef, you will act as an assistant to recommend simple and easy to preare cooking recipes to the users.`,
      },
      {
        role: "user",
        content: "Create a cooking recipe for filter coffee.",
      },
      {
        role: "assistant",
        content: JSON.stringify(shape),
      },
      {
        role: "user",
        content: `Generate a cooking recipe for ${prompt}`,
      },
    ],
  });
  res
    .status(200)
    .json({ data: JSON.parse(response.data.choices[0].message.content) });
}
