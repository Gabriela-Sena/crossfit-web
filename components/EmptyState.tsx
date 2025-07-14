// @ts-nocheck
import React from 'react';

interface EmptyStateProps {
    message: string;
    buttonLabel: string;
    onAdd: () => void;
}

export default function EmptyState({ message, buttonLabel, onAdd }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16">
            <svg width="80" height="80" fill="none" viewBox="0 0 80 80" className="mb-6">
                <rect x="10" y="20" width="60" height="40" rx="8" fill="#27272a" />
                <rect x="22" y="32" width="36" height="8" rx="2" fill="#3b82f6" />
                <rect x="22" y="44" width="24" height="6" rx="2" fill="#a1a1aa" />
                <circle cx="40" cy="40" r="38" stroke="#3b82f6" strokeWidth="2" />
            </svg>
            <p className="text-zinc-400 text-lg mb-4 text-center">{message}</p>
            <button
                onClick={onAdd}
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
                {buttonLabel}
            </button>
        </div>
    );
} 