import openai from "./openaiService.js";

export const streamAIResponse = async ({
  messages,
  res,
}) => {
  const stream =
    await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      stream: true,
      messages,
    });

  let fullReply = "";

  for await (const chunk of stream) {
    const content =
      chunk.choices?.[0]?.delta?.content || "";

    if (content) {
      fullReply += content;
      res.write(content);
    }
  }

  return fullReply;
};