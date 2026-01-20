import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'success' | 'error';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`fixed bottom-8 right-8 z-[200] flex items-center gap-4 px-6 py-4 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border backdrop-blur-md ${type === 'success'
                ? 'bg-white/90 border-green-100 text-green-900'
                : 'bg-white/90 border-red-100 text-red-900'
                }`}
        >
            <div className={`p-2 rounded-full ${type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                {type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                )}
            </div>
            <div>
                <p className="text-xs font-black uppercase tracking-wider">{type === 'success' ? 'Success' : 'Error'}</p>
                <p className="text-xs font-medium opacity-80">{message}</p>
            </div>
            <button onClick={onClose} className="ml-4 p-1 hover:bg-black/5 rounded-full transition-colors">
                <X className="w-4 h-4 opacity-40" />
            </button>
        </motion.div>
    );
};

export default Toast;
