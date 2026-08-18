type ScopeMessage = { role: "assistant" | "user"; content: string };

const OUT_OF_SCOPE_PATTERNS = [
  /\b(?:startup|business|app|saas)\s+ideas?\b/i,
  /\b(?:write|give|generate|create|show|provide|debug|fix)\b.{0,80}\b(?:html|css|javascript|typescript|python|java|php|sql|source\s+code|code|script|function|regex|calculator)\b/i,
  /\b(?:html|css|javascript|typescript|python|java|php|sql)\s+(?:code|example|tutorial)\b/i,
  /\b(?:write|make|tell|give)\b.{0,50}\b(?:poem|essay|story|joke|recipe|homework|assignment)\b/i,
  /\b(?:weather|sports?\s+score|politics|stock\s+price|crypto\s+price|solve\s+this\s+(?:math|equation))\b/i,
];

export const outOfScopeReply = "I’m here specifically to help with SalonVault services, beauty-business websites, growth systems, salon software, and your inquiry. I can’t help with unrelated requests, but I’d be happy to answer anything about your salon project.";

export function isClearlyOutOfScope(messages: ScopeMessage[]) {
  const latestUserMessage = messages.findLast((message) => message.role === "user")?.content.trim();
  return Boolean(latestUserMessage && OUT_OF_SCOPE_PATTERNS.some((pattern) => pattern.test(latestUserMessage)));
}
