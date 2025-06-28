
import React, { useEffect, useRef } from 'react';
import { XIcon } from './IconComponents';

interface HowItWorksModalProps {
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close modal on escape key press
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    // Close modal on backdrop click
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="how-it-works-title"
        >
            <div 
                ref={modalRef}
                className="bg-slate-800 text-slate-200 rounded-xl shadow-2xl w-full max-w-md border border-slate-600 animate-card-refresh"
            >
                <header className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 id="how-it-works-title" className="text-xl font-bold text-transparent bg-clip-text bg-rgb-text-gradient bg-300% animate-rgb-text-flow">
                        Как это работает?
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-light"
                        aria-label="Закрыть модальное окно"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </header>
                <div className="p-6 space-y-4">
                    <p>Этот AI-помощник представляет собой современное веб-приложение, созданное с использованием передовых технологий.</p>
                    <div>
                        <h3 className="font-semibold text-primary-light mb-2">Технологический стек:</h3>
                        <ul className="list-disc list-inside space-y-2 text-slate-300">
                            <li><strong>Интерфейс (Frontend):</strong> Написан на <span className="font-semibold text-white">React</span> с использованием <span className="font-semibold text-white">TypeScript</span> для надежности и <span className="font-semibold text-white">Tailwind CSS</span> для создания стильного и адаптивного дизайна.</li>
                            <li><strong>AI Модель:</strong> В основе лежит мощная модель <span className="font-semibold text-white">Google Gemini (gemini-2.5-flash-preview-04-17)</span>, доступ к которой осуществляется через официальный SDK <span className="font-semibold text-white">@google/genai</span>.</li>
                            <li><strong>Хостинг (Hosting):</strong> Приложение развернуто на платформе <span className="font-semibold text-white">Vercel</span>, что обеспечивает высокую скорость и доступность по всему миру.</li>
                        </ul>
                    </div>
                    <p>Все это создано и поддерживается командой <span className="font-semibold text-transparent bg-clip-text bg-rgb-text-gradient bg-300% animate-rgb-text-flow">Natez Team</span>.</p>
                </div>
                 <footer className="p-4 bg-slate-800 rounded-b-xl text-center">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-6 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-primary-dark transition-colors"
                    >
                        Понятно
                    </button>
                </footer>
            </div>
        </div>
    );
};
