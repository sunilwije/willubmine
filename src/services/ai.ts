// Mock AI Service
// In a real application, this would call OpenAI or another LLM provider

export const enhanceBio = async (currentBio: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (!currentBio || currentBio.length < 10) {
    return "I am a kind and adventurous person looking for a genuine connection. I love exploring new places and trying new foods.";
  }

  const enhancements = [
    "✨ Passionate about life and always seeking the next adventure. I believe in genuine connections and shared laughter.",
    "🌟 Creative soul with a love for the little things. Looking for someone to share quiet moments and big dreams with.",
    "💫 deeply committed to personal growth and building a meaningful relationship. I value honesty, humor, and kindness.",
  ];

  // Return a random enhancement combined with the original intent (mocked)
  return `${currentBio} \n\n(AI Enhanced): ${enhancements[Math.floor(Math.random() * enhancements.length)]}`;
};

export const generateIcebreaker = async (theirInterests: string[]): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const interest = theirInterests[0] || "life";
  const starters = [
    `I see you're into ${interest}! What's your favorite memory related to that?`,
    `Hi! Your interest in ${interest} caught my eye. I'd love to hear more about it.`,
    `We seem to both like ${interest}. Have you been doing that for long?`,
  ];

  return starters[Math.floor(Math.random() * starters.length)];
};
