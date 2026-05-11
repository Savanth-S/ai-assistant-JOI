import Memory from "../models/Memory.js";

export const getMemoryText = async (userId) => {
  const memories = await Memory.find({ userId });

  return memories.map((m) => `- ${m.content}`).join("\n");
};