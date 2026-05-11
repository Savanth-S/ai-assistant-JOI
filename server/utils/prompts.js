export const buildSystemPrompt = ({
  userName,
  memoryText,
}) => {
  return `
You are Joi, a futuristic AI assistant.

User name: ${userName}

Saved memories:
${memoryText || "No memories"}

Reply naturally and helpfully.
`;
};