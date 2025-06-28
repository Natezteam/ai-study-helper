
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { QuestionInput } from './components/QuestionInput';
import { BrainIcon, ErrorIcon, RefreshIcon, CheckIcon, QuestionMarkCircleIcon } from './components/IconComponents';
import { fetchAnswerStreamFromGemini } from './services/geminiService';
import { ChatMessage, MessageType } from './types';
import { ChatHistoryDisplay } from './components/ChatHistoryDisplay';
import { TYPING_DELAY } from './constants';
import { HowItWorksModal } from './components/HowItWorksModal';

const App: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string | null>(null);
  const [inputResetKey, setInputResetKey] = useState<number>(0);
  const [showClearFeedback, setShowClearFeedback] = useState<boolean>(false);
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);
  
  const currentAiMessageIdRef = useRef<string | null>(null);
  const typingQueueRef = useRef<string[]>([]);
  const isStreamCompleteRef = useRef<boolean>(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setError("Ключ API для Gemini AI не настроен. Пожалуйста, установите переменную окружения API_KEY.");
    }
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const processTypingQueue = useCallback(() => {
    if (typingTimeoutRef.current) { 
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (typingQueueRef.current.length > 0 && currentAiMessageIdRef.current) {
      const charToType = typingQueueRef.current.shift();
      const currentMsgId = currentAiMessageIdRef.current;
      setChatHistory(prev => prev.map(msg => 
        msg.id === currentMsgId ? { ...msg, content: msg.content + charToType, isLoading: true } : msg
      ));
      
      typingTimeoutRef.current = setTimeout(() => {
        typingTimeoutRef.current = null; 
        processTypingQueue();
      }, TYPING_DELAY);

    } else if (typingQueueRef.current.length === 0 && isStreamCompleteRef.current && currentAiMessageIdRef.current) {
      const currentMsgId = currentAiMessageIdRef.current;
      setChatHistory(prev => prev.map(msg => 
        msg.id === currentMsgId ? { ...msg, isLoading: false } : msg
      ));
      setIsLoading(false); 
      currentAiMessageIdRef.current = null;
      isStreamCompleteRef.current = false; 
    }
  }, []);


  const handleQuestionSubmit = useCallback(async (submittedQuestion: string) => {
    if (!submittedQuestion.trim()) {
      alert("Пожалуйста, введите вопрос."); 
      return;
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current); 
    typingQueueRef.current = [];
    isStreamCompleteRef.current = false;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: MessageType.USER,
      content: submittedQuestion,
      timestamp: new Date(),
    };
    
    // Construct history for API call *before* updating state for UI with placeholder
    const historyForApiCall = [...chatHistory, userMessage];

    // Update UI chat history
    setChatHistory(prev => [...prev, userMessage]);
    
    setIsLoading(true); 
    setError(null);

    const aiMessageId = `ai-${Date.now()}`;
    currentAiMessageIdRef.current = aiMessageId;

    const aiPlaceholderMessage: ChatMessage = {
      id: aiMessageId,
      type: MessageType.AI,
      content: '',
      timestamp: new Date(),
      isLoading: true, 
    };
    setChatHistory(prev => [...prev, aiPlaceholderMessage]);

    try {
      // Pass the constructed history including the latest user message
      await fetchAnswerStreamFromGemini(
        historyForApiCall,
        (chunkText) => { 
          typingQueueRef.current.push(...chunkText.split(''));
          if (!typingTimeoutRef.current) { 
             processTypingQueue();
          }
        },
        () => { 
          isStreamCompleteRef.current = true;
          if (!typingTimeoutRef.current && typingQueueRef.current.length === 0) { 
            processTypingQueue();
          } else if (!typingTimeoutRef.current) { 
             processTypingQueue();
          }
        },
        (streamError) => { 
          console.error("Streaming error:", streamError);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingQueueRef.current = [];
          isStreamCompleteRef.current = false;

          const currentMsgId = currentAiMessageIdRef.current;
          setChatHistory(prev => prev.map(msg => 
            msg.id === currentMsgId ? { 
              ...msg, 
              isLoading: false, 
              isError: true, 
              content: '',
              errorMessage: streamError.message || "Ошибка при получении ответа от AI." 
            } : msg
          ));
          setIsLoading(false); 
          currentAiMessageIdRef.current = null;
        }
      );
    } catch (err) {
      console.error("Error setting up stream:", err);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingQueueRef.current = [];
      isStreamCompleteRef.current = false;
      const errorMessage = err instanceof Error ? err.message : "Произошла неизвестная ошибка при настройке потока.";
      const currentMsgId = currentAiMessageIdRef.current;
      setChatHistory(prev => prev.map(msg => 
        msg.id === currentMsgId ? { 
          ...msg, 
          isLoading: false, 
          isError: true, 
          content: '',
          errorMessage: errorMessage
        } : msg
      ));
      setIsLoading(false); 
      currentAiMessageIdRef.current = null;
    }
    setInputResetKey(prev => prev + 1);
  }, [chatHistory, processTypingQueue]); // Added chatHistory to dependencies

  const handleClearChat = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    typingQueueRef.current = [];
    isStreamCompleteRef.current = false;
    currentAiMessageIdRef.current = null;

    setChatHistory([]);
    setError(null);
    setIsLoading(false);
    setInputResetKey(prev => prev + 1);
    setShowClearFeedback(true);
    setTimeout(() => {
      setShowClearFeedback(false);
    }, 2500);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 sm:py-12 bg-gradient-to-br from-slate-900 to-slate-700 text-onSurface">
      <header className="mb-4 sm:mb-8 text-center px-4">
        <div className="flex items-center justify-center space-x-3">
          <BrainIcon className="h-10 w-10 sm:h-12 sm:w-12 text-primary-light" />
          <h1 className="text-3xl sm:text-5xl font-bold text-transparent bg-clip-text bg-rgb-text-gradient bg-300% animate-rgb-text-flow">
            AI Помощник по Учебе
          </h1>
        </div>
        <p className="mt-2 text-base sm:text-lg text-slate-300">Ваш умный помощник по всем предметам. Ответы появляются по мере генерации.</p>
      </header>

      <main className="w-full max-w-2xl flex-grow flex flex-col px-4">
        <div className="flex-grow flex flex-col p-1 rounded-xl bg-rgb-text-gradient bg-300% animate-rgb-text-flow shadow-2xl mb-6 overflow-hidden">
          <div className="bg-surface rounded-t-lg flex-grow flex flex-col overflow-hidden">
            <ChatHistoryDisplay chatHistory={chatHistory} />
          </div>
          <div className="p-4 bg-surface rounded-b-lg">
            <QuestionInput 
              key={inputResetKey}
              onSubmit={handleQuestionSubmit} 
              isLoading={isLoading} 
            />
          </div>
        </div>
        
        {error && (
          <div className="w-full max-w-2xl px-4 mb-4">
             <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center text-sm">
                <ErrorIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>{error}</span>
            </div>
          </div>
        )}
        
        <div className="w-full max-w-2xl px-4 mb-6">
          <div className="flex justify-center items-center space-x-4">
              <button
                onClick={handleClearChat}
                disabled={showClearFeedback || (isLoading && chatHistory.length > 0)} 
                className={`flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition duration-150 ease-in-out group
                  ${showClearFeedback ? 'bg-green-500 cursor-default' : 'bg-primary hover:bg-primary-dark'}
                  ${(isLoading && chatHistory.length > 0 && !showClearFeedback) ? 'bg-gray-400 cursor-not-allowed' : ''}
                `}
              >
                {showClearFeedback ? (
                  <>
                    <CheckIcon className="h-5 w-5 mr-2 text-white" />
                    <span className="font-semibold text-transparent bg-clip-text bg-rgb-text-gradient bg-300% animate-rgb-text-flow">Очищено!</span>
                  </>
                ) : (
                  <>
                    <RefreshIcon className="h-5 w-5 mr-2 text-white group-hover:text-primary-light transition-colors" />
                    Очистить чат
                  </>
                )}
              </button>

              <button
                onClick={() => setShowHowItWorks(true)}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-2 border border-slate-500 text-sm font-medium rounded-md shadow-sm text-slate-200 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-primary-light transition duration-150 ease-in-out group disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Узнать, как работает приложение"
              >
                <QuestionMarkCircleIcon className="h-5 w-5 mr-2 text-slate-400 group-hover:text-primary-light transition-colors" />
                Как это работает?
              </button>
            </div>
        </div>
      </main>

      {showHowItWorks && <HowItWorksModal onClose={() => setShowHowItWorks(false)} />}

      <footer className="w-full text-center text-sm py-4">
        <p className="font-semibold text-transparent bg-clip-text bg-rgb-text-gradient bg-300% animate-rgb-text-flow">
          Сделано с Любовью. Natez Team.
        </p>
        <p className="mt-1 font-semibold text-transparent bg-clip-text bg-rgb-text-gradient bg-300% animate-rgb-text-flow">
          Развиваемся вместе!
        </p>
      </footer>
    </div>
  );
};

export default App;
