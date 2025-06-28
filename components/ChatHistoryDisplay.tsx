
import React, { useEffect, useRef } from 'react';
import { ChatMessage, MessageType } from '../types';
import { AnswerDisplay } from './AnswerDisplay'; // To display AI messages
import { UserIcon, AISparkleIcon } from './IconComponents'; 

const UserMessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => (
  <div className="flex justify-end mb-3">
    <div className="flex items-start space-x-2">
        {/* User Icon can be placed here if desired, on the right of the bubble */}
        {/* <UserIcon className="h-6 w-6 text-slate-500 flex-shrink-0 order-last" /> */}
        <div className="bg-primary text-white p-3 rounded-lg max-w-xs sm:max-w-md lg:max-w-lg shadow-md">
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        {/* Optional: <span className="text-xs text-blue-200 block text-right mt-1">{message.timestamp.toLocaleTimeString()}</span> */}
        </div>
    </div>
  </div>
);


const AIMessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => (
   <div className="flex justify-start mb-3">
    <div className="bg-surface p-0 rounded-lg max-w-xs sm:max-w-md lg:max-w-lg shadow-md w-full"> {/* w-full to allow AnswerDisplay to control its padding */}
      <AnswerDisplay 
        content={message.content}
        isStreaming={message.isLoading}
        isError={message.isError}
        errorMessage={message.errorMessage}
        // timestamp={message.timestamp} 
      />
    </div>
  </div>
);


interface ChatHistoryDisplayProps {
  chatHistory: ChatMessage[];
}

export const ChatHistoryDisplay: React.FC<ChatHistoryDisplayProps> = ({ chatHistory }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-4"> {/* Removed bg-slate-50 and rounded-t-lg */}
      {chatHistory.length === 0 && (
        <div className="text-center text-slate-500 py-10">
          <AISparkleIcon className="h-12 w-12 mx-auto text-slate-400 mb-3" />
          <p className="font-medium">История чата пуста.</p>
          <p className="text-sm">Задайте вопрос, чтобы начать диалог с AI.</p>
        </div>
      )}
      {chatHistory.map((msg) => (
        msg.type === MessageType.USER 
          ? <UserMessageBubble key={msg.id} message={msg} />
          : <AIMessageBubble key={msg.id} message={msg} />
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};
