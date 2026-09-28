export interface Suggestion {
  title: string;
  description: string;
  prompt: string;
}

export const SUGGESTION_POOL: Suggestion[] = [
  {
    title: "Unlock Your Creative Flow",
    description: "Get a writing prompt to break through a block",
    prompt: "Give me a creative writing prompt to help me break through a block today.",
  },
  {
    title: "Build a Resume That Shines",
    description: "Rewrite a bullet point to sound stronger",
    prompt: "Help me rewrite my resume bullet points to sound more impactful.",
  },
  {
    title: "Set a Challenge That Transforms You",
    description: "Design a 7-day personal challenge",
    prompt: "Design a 7-day personal challenge that will push me out of my comfort zone.",
  },
  {
    title: "Write Irresistible Social Content",
    description: "Draft a hook for your next post",
    prompt: "Write three hook options for a social media post about a new product launch.",
  },
  {
    title: "Debug a Tricky Function",
    description: "Walk through a bug step by step",
    prompt: "I have a bug in a function that's returning the wrong value. Can you help me debug it?",
  },
  {
    title: "Summarize Anything, Fast",
    description: "Condense a long article into key points",
    prompt: "Summarize the key points of a long article for me.",
  },
  {
    title: "Plan Your Next Trip",
    description: "Sketch a flexible day-by-day itinerary",
    prompt: "Help me plan a relaxed 4-day itinerary for a trip.",
  },
  {
    title: "Prep for a Big Interview",
    description: "Practice a behavioral question",
    prompt: "Ask me a behavioral interview question and give me feedback on my answer.",
  },
];

export function pickRandomSuggestions(count = 4): Suggestion[] {
  const shuffled = [...SUGGESTION_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
