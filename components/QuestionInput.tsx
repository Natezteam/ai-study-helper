
import React, { useState, useEffect } from 'react';
import { SendIcon } from './IconComponents';
import { MAX_QUESTION_LENGTH } from '../constants';

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
  // key prop is implicitly handled by React for resetting state
}

export const QuestionInput: React.FC<QuestionInputProps> = ({ onSubmit, isLoading }) => {
  const [questionText, setQuestionText] = useState<string>('');

  // When the key changes (externally controlled by App.tsx's inputResetKey),
  // this effect will run, effectively allowing a reset if needed,
  // but primary reset is handled by setQuestionText('') in handleSubmit.
  // This component now primarily manages its own text state.

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (questionText.trim() && !isLoading) {
      onSubmit(questionText.trim());
      setQuestionText(''); // Clear input after successful submission
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_QUESTION_LENGTH) {
      setQuestionText(e.target.value);
    }
  };
  
  const remainingChars = MAX_QUESTION_LENGTH - questionText.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1 sr-only">
          Задайте свой вопрос:
        </label>
        <div className="relative">
          <textarea
            id="question"
            name="question"
            rows={3} // Adjusted rows for a more compact input area within chat context
            value={questionText}
            onChange={handleInputChange}
            placeholder="Введите ваш учебный вопрос здесь..."
            className="w-full p-3 pr-12 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition duration-150 ease-in-out resize-none text-gray-800 placeholder-gray-400"
            disabled={isLoading}
            maxLength={MAX_QUESTION_LENGTH}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any); // Type assertion, or wrap in a synthetic event
              }
            }}
          />
          <div className={`absolute bottom-2 right-3 text-xs ${remainingChars < 50 ? 'text-red-500' : 'text-gray-400'}`}>
            {remainingChars}
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading || !questionText.trim()}
        className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:bg-slate-400 disabled:cursor-not-allowed transition duration-150 ease-in-out group"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Отправка...
          </>
        ) : (
          <>
            <SendIcon className="h-5 w-5 mr-2 text-white group-hover:text-primary-light transition-colors" />
            Спросить AI
          </>
        )}
      </button>
    </form>
  );
};
