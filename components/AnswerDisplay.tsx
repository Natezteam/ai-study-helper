
import React, { useState, useCallback } from 'react';
import { AISparkleIcon, CopyIcon, CheckIcon, ErrorIcon, LoadingSpinner } from './IconComponents';

interface AnswerDisplayProps {
  content: string;
  isStreaming?: boolean; // Indicates if content is still being streamed
  isError?: boolean;
  errorMessage?: string;
  showTimestamp?: boolean; // Optional: To display timestamp
  timestamp?: Date;      // Optional: The timestamp
}

export const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ 
  content, 
  isStreaming, 
  isError, 
  errorMessage 
}) => {
  const [showCopyFeedback, setShowCopyFeedback] = useState<boolean>(false);

  const handleCopyAnswer = useCallback(async () => {
    if (showCopyFeedback || !content || isError) return;

    try {
      await navigator.clipboard.writeText(content);
      setShowCopyFeedback(true);
      setTimeout(() => {
        setShowCopyFeedback(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }, [content, showCopyFeedback, isError]);

  const displayContent = isError ? (errorMessage || "Произошла ошибка.") : content;

  return (
    <div className={`p-3 sm:p-4 rounded-lg shadow-sm relative group ${isError ? 'bg-red-50 border-red-200' : 'bg-sky-50 border-sky-200'} border`}>
      <div className="flex items-start space-x-2 sm:space-x-3">
        {isError ? (
          <ErrorIcon className="h-6 w-6 sm:h-7 sm:w-7 text-red-500 flex-shrink-0 mt-0.5" />
        ) : (
          <AISparkleIcon className="h-6 w-6 sm:h-7 sm:w-7 text-primary flex-shrink-0 mt-0.5" />
        )}
        <div className="flex-grow min-w-0"> {/* Added min-w-0 for proper text wrapping */}
          <div className="flex items-center justify-between mb-1">
             <h3 className={`text-sm font-semibold ${isError ? 'text-red-700' : 'text-primary-dark'}`}>
              {isError ? "Ошибка AI" : "Ответ AI"}
            </h3>
            {!isError && !isStreaming && content && (
               <button
                onClick={handleCopyAnswer}
                disabled={showCopyFeedback}
                className={`flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition duration-150 ease-in-out
                  ${showCopyFeedback 
                    ? 'bg-green-500 text-white cursor-default' 
                    : 'text-primary-dark bg-sky-100 hover:bg-sky-200 focus:ring-sky-300 opacity-0 group-hover:opacity-100'
                  }`}
                aria-label={showCopyFeedback ? "Скопировано" : "Копировать ответ"}
                aria-live="polite"
              >
                {showCopyFeedback ? (
                  <>
                    <CheckIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-white" />
                    <span className="text-xs">Скопировано!</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-primary group-hover:text-primary-dark transition-colors" />
                    <span className="text-xs">Копировать</span>
                  </>
                )}
              </button>
            )}
          </div>
          <div className={`prose prose-sm max-w-none ${isError ? 'text-red-600' : 'text-onSurface'} whitespace-pre-wrap break-words`}>
            {displayContent}
            {isStreaming && <span className="inline-block w-1 h-4 bg-slate-600 animate-pulse ml-1" aria-label="AI печатает..."></span>}
          </div>
           {isStreaming && !content && ( // Show spinner if streaming has started but no content yet
            <div className="flex items-center text-sm text-slate-500 mt-2">
              <LoadingSpinner className="h-5 w-5 text-primary"/>
              <span className="ml-2">AI генерирует ответ...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
