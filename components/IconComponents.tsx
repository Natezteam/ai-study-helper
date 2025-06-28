
import React from 'react';

interface IconProps {
  className?: string;
}

export const BrainIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.871 14.596c-1.127.643-2.022 1.68-2.532 2.915A2.999 2.999 0 004.5 21h15a2.998 2.998 0 002.16-5.488c-.509-1.235-1.405-2.272-2.532-2.915m-14.256 0c1.127-.643 2.022-1.68 2.532-2.915m11.724 2.915c-1.127-.643-2.022-1.68-2.532-2.915m0 0A5.992 5.992 0 0012 9.75a5.992 5.992 0 00-4.871 1.931m9.742 0A5.993 5.993 0 0012 9.75V7.5M7.129 11.681A5.993 5.993 0 0112 9.75V7.5m0 4.181V15m5.25-6.819C16.125 6.096 14.188 5.25 12 5.25c-2.188 0-4.125.846-5.25 2.181M12 3v2.25" />
  </svg>
);

export const SendIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

export const ErrorIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const AISparkleIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6.278 7.343l2.829-2.829M10.107 4.514l-2.829 2.829M5 21v-4M3 19h4m-.722-2.657l2.829 2.829M10.107 19.486l-2.829-2.829M19 3v4M17 5h4m-.722 2.343l2.829-2.829M20.936 4.514l-2.829 2.829M19 21v-4M17 19h4m-.722-2.657l2.829 2.829M20.936 19.486l-2.829-2.829M12 5.25c-1.485 0-2.697 1.212-2.697 2.697S10.515 10.644 12 10.644s2.697-1.212 2.697-2.697S13.485 5.25 12 5.25zm0 8.106c-1.485 0-2.697 1.212-2.697 2.697s1.212 2.697 2.697 2.697 2.697-1.212 2.697-2.697-1.212-2.697-2.697-2.697z" />
  </svg>
);

export const CopyIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"> {/* Increased strokeWidth for visibility */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export const RefreshIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l5 5M20 20l-5-5M4 4c1.333-1.333 3.4-2 5.75-1.95A7.502 7.502 0 0117.5 9.75M20 20c-1.333 1.333-3.4 2-5.75 1.95A7.502 7.502 0 016.5 14.25" />
  </svg>
);

export const LoadingSpinner: React.FC<IconProps> = ({ className = "h-10 w-10 text-primary" }) => {
  return (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
};

export const UserIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export const QuestionMarkCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const XIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
