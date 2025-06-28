
import { GoogleGenAI, GenerateContentResponse, Content } from "@google/genai";
import { GEMINI_MODEL_NAME, SYSTEM_INSTRUCTION } from '../constants';
import { ChatMessage, MessageType } from "../types";

const getApiKey = (): string | undefined => process.env.API_KEY;

let ai: GoogleGenAI | null = null;

const initializeAi = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("API_KEY for Gemini AI is not configured.");
    return null;
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

const formatHistoryForApi = (history: ChatMessage[]): Content[] => {
  return history.map(msg => ({
    role: msg.type === MessageType.USER ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));
};

export const fetchAnswerStreamFromGemini = async (
  history: ChatMessage[],
  onChunk: (chunkText: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
): Promise<void> => {
  const currentAi = initializeAi();
  if (!currentAi) {
    onError(new Error("Ключ API не настроен. Пожалуйста, проверьте конфигурацию."));
    return;
  }

  if (history.length === 0) {
    onError(new Error("История чата пуста. Нечего отправлять AI."));
    return;
  }

  try {
    const formattedContents = formatHistoryForApi(history);

    const responseStream = await currentAi.models.generateContentStream({
      model: GEMINI_MODEL_NAME,
      contents: formattedContents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    for await (const chunk of responseStream) {
      const chunkText = chunk.text;
      if (typeof chunkText === 'string') {
        onChunk(chunkText);
      }
    }
    onComplete();

  } catch (error) {
    console.error("Error calling Gemini API (stream):", error);
    let specificError: Error;
    let errorMessageDetail = "Произошла неизвестная ошибка."; 

    if (error instanceof Error) {
        errorMessageDetail = error.message;
    } else if (typeof error === 'string') {
        errorMessageDetail = error;
    } else if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
        errorMessageDetail = error.message;
    }
    
    let parsedNestedMessage = "";
    try {
        if (errorMessageDetail.trim().startsWith('{') && errorMessageDetail.trim().endsWith('}')) {
            const parsedJson = JSON.parse(errorMessageDetail);
            if (parsedJson?.error?.message && typeof parsedJson.error.message === 'string') {
                parsedNestedMessage = parsedJson.error.message;
            } else if (parsedJson?.message && typeof parsedJson.message === 'string') {
                parsedNestedMessage = parsedJson.message;
            }
        }
    } catch (e) {
        // Not a JSON string or failed to parse, proceed
    }

    const finalErrorMessage = parsedNestedMessage || errorMessageDetail;

    if (finalErrorMessage.toLowerCase().includes('api key not valid') || finalErrorMessage.toLowerCase().includes('api_key_invalid')) {
        specificError = new Error("Ключ API недействителен или отсутствует. Проверьте конфигурацию.");
    } else if (finalErrorMessage.toLowerCase().includes('fetch') || finalErrorMessage.includes('http status code: 0') || finalErrorMessage.includes('networkerror')) {
        specificError = new Error(`Ошибка сети или соединения при обращении к AI. Проверьте ваше интернет-соединение. (Детали: ${finalErrorMessage})`);
    } else if (finalErrorMessage.toLowerCase().includes('quota') || (error as any)?.status === 429) {
        specificError = new Error("Превышена квота запросов к AI. Пожалуйста, попробуйте позже.");
    } else if (finalErrorMessage.toLowerCase().includes('moderation') || finalErrorMessage.toLowerCase().includes('blocked')) {
        specificError = new Error("Запрос был заблокирован из-за нарушения правил безопасности контента.");
    } else if (finalErrorMessage.includes('timeout') || finalErrorMessage.includes('timed out')) {
        specificError = new Error("Время ожидания ответа от AI истекло. Пожалуйста, попробуйте позже.");
    }
     else {
        specificError = new Error(`Ошибка от AI: ${finalErrorMessage}. Попробуйте позже.`);
    }
    
    onError(specificError);
  }
};

export const fetchAnswerFromGemini = async (history: ChatMessage[]): Promise<string> => {
  const currentAi = initializeAi();
   if (!currentAi) {
    throw new Error("Ключ API не настроен. Пожалуйста, проверьте конфигурацию.");
  }
   if (history.length === 0) {
    throw new Error("История чата пуста. Нечего отправлять AI.");
  }

  try {
    const formattedContents = formatHistoryForApi(history);
    const response: GenerateContentResponse = await currentAi.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: formattedContents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    
    const text = response.text;

    if (typeof text === 'string') {
      return text.trim();
    } else {
      console.warn("Received non-string response or no text from Gemini:", response);
      throw new Error("AI не смог предоставить ответ в ожидаемом формате.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    let errorMessageDetail = "Произошла неизвестная ошибка.";
    if (error instanceof Error) {
        errorMessageDetail = error.message;
    } else if (typeof error === 'string') {
        errorMessageDetail = error;
    }
    
    if (errorMessageDetail.toLowerCase().includes('api key not valid') || errorMessageDetail.toLowerCase().includes('api_key_invalid')) {
         throw new Error("Ключ API недействителен. Пожалуйста, проверьте конфигурацию.");
    }
    if (errorMessageDetail.toLowerCase().includes('fetch') || errorMessageDetail.includes('networkerror')) {
         throw new Error("Ошибка сети при обращении к AI. Пожалуйста, проверьте ваше интернет-соединение.");
    }
     throw new Error(`Ошибка от AI: ${errorMessageDetail}. Попробуйте переформулировать вопрос или повторить попытку позже.`);
  }
};
