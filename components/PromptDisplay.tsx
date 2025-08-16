
import React, { useState } from 'react';
import type { GeneratedPrompts } from '../types';
import { CopyIcon, CheckIcon } from './Icons';

interface PromptDisplayProps {
  prompts: GeneratedPrompts | null;
  isLoading: boolean;
}

const PromptCard: React.FC<{ title: string; content: string; lang: 'en' | 'vi' }> = ({ title, content, lang }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };
  
  const cardLangClass = lang === 'vi' ? 'font-sans' : 'font-mono';

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex-1 min-w-[300px]">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
        <button
          onClick={handleCopy}
          className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
          aria-label={copied ? 'Copied' : 'Copy prompt'}
        >
          {copied ? <CheckIcon className="h-5 w-5 text-green-400" /> : <CopyIcon className="h-5 w-5" />}
        </button>
      </div>
      <p className={`text-gray-300 whitespace-pre-wrap text-sm leading-relaxed ${cardLangClass}`}>
        {content}
      </p>
    </div>
  );
};


const LoadingSkeleton: React.FC = () => {
    return (
        <div className="animate-pulse bg-gray-800 border border-gray-700 rounded-lg p-4 flex-1 min-w-[300px]">
            <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
        </div>
    );
};


export const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompts, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row gap-6">
        <LoadingSkeleton />
        <LoadingSkeleton />
      </div>
    );
  }

  if (!prompts) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <PromptCard title="English Prompt" content={prompts.english_prompt} lang="en" />
      <PromptCard title="Prompt Tiếng Việt" content={prompts.vietnamese_prompt} lang="vi" />
    </div>
  );
};
