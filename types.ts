// types.ts

export enum MessageType {
  USER = 'user',
  AI = 'ai',
}

export interface ChatMessage {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  isLoading?: boolean; // For AI messages during streaming or initial load
  isError?: boolean;   // If an error occurred fetching this AI message
  errorMessage?: string; // Content of the error message
}

// Keep this for potential future global types, but ChatMessage is primary now.
export {}; // Ensures this file is treated as a module.