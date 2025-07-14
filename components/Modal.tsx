// @ts-nocheck
import React, { useEffect } from 'react';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    maxWidth?: string; // ex: 'max-w-3xl'
}

export default function Modal({ open, onClose, title, children, maxWidth }: ModalProps) {
    useEffect(() => {
        if (!open) return;
        function handleKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [open, onClose]);

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
            <div
                className={`bg-zinc-900 rounded-2xl shadow-xl p-8 ${maxWidth || 'max-w-3xl'} w-full relative animate-fade-in`}
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={title}
            >
                {title && <h2 className="text-xl font-bold text-zinc-100 mb-4">{title}</h2>}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 text-2xl font-bold focus:outline-none"
                    aria-label="Fechar modal"
                >
                    ×
                </button>
                {children}
            </div>
        </div>
    );
} 