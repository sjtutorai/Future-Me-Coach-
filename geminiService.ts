
import { GoogleGenAI, Modality } from "@google/genai";
import { UserProfile, UserStats, Personality } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getPersonalityPrompt = (personality: Personality) => {
  switch (personality) {
    case 'Strict':
      return "You are a future version of the user. Your tone is cold, disciplined, and uncompromising. You do not offer praise easily. You focus on the cost of failure and the weight of wasted time.";
    case 'Calm':
      return "You are a future version of the user. Your tone is stoic, peaceful, and perspective-driven. You focus on long-term consistency and the beauty of small, intentional steps.";
    case 'Friendly':
      return "You are a future version of the user. Your tone is warm, supportive, but firm. You act as an older, wiser sibling who wants the absolute best for the current version of you.";
    default:
      return "";
  }
};

export const generateDailyMessage = async (user: UserProfile, stats: UserStats) => {
  const personalityInstruction = getPersonalityPrompt(user.personality);
  const prompt = `
    ${personalityInstruction}
    I am currently in the year ${new Date().getFullYear()}, and I am reaching back from ${user.futureYears} in the future.
    My current career goals: ${user.careerGoals}
    My lifestyle goals: ${user.lifestyleGoals}
    My current streak: ${stats.streak} days.
    Last active: ${stats.lastActive || 'Never'}.

    Write a short, impactful message to my current self for today. 
    Focus on discipline and avoiding regret. 
    Make it emotional and serious. 
    Keep it under 60 words. No emojis.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text;
};

export const generateSilentJudge = async (user: UserProfile, stats: UserStats) => {
  const prompt = `
    Act as my future self from ${user.futureYears} away. 
    Current streak: ${stats.streak}.
    You are in 'Silent Judge' mode. 
    Provide EXACTLY ONE short sentence. 
    Be cold and direct. 
    No emojis. No motivational quotes. Just the raw truth of my current trajectory.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text;
};

export const generateReverseRegret = async (user: UserProfile, timeSpan: string) => {
  const prompt = `
    Act as my future self. 
    Describe a specific, haunting regret I will feel in ${timeSpan} if I stop being consistent with my ${user.careerGoals} and ${user.lifestyleGoals} today.
    Make it deeply emotional and visceral. 
    Start with "I remember the day you quit...".
    Keep it under 50 words. No emojis.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text;
};

/**
 * TTS HELPER FUNCTIONS
 */

function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodePCMToAudioBuffer(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const generateSpeech = async (text: string, personality: Personality) => {
  const voiceMap = {
    'Strict': 'Zephyr',
    'Calm': 'Kore',
    'Friendly': 'Puck'
  };

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voiceMap[personality] || 'Zephyr' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) return null;

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const audioBytes = decodeBase64(base64Audio);
  const audioBuffer = await decodePCMToAudioBuffer(audioBytes, audioContext, 24000, 1);
  
  return { audioBuffer, audioContext };
};
