"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AiFillInfoCircle } from 'react-icons/ai';
import { IoIosLock } from 'react-icons/io';
import { IoCheckmarkOutline } from "react-icons/io5";
import { roboto } from '@/utils/Fonts';

type ToastProps = {
    type: string;
    message: string;
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    duration?: number;
    onClose: () => void;
};

const Toast: React.FC<ToastProps> = ({ type, message, duration = 3000, onClose }) => {
    const [styles, setStyles] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        switch (type) {
            case "success":
                setStyles("bg-green-600 text-white");
                break;
            case "error":
                setStyles("bg-red-500 text-white");
                break;
            case "info":
                setStyles("bg-yellow-600 text-white");
                break;
            default:
                setStyles("bg-green-500 text-white");
                break;
        }

        return () => {
            clearTimeout(timer);
        };
    }, [duration, onClose, type]);

    return (
        <div
            className={`${roboto.className} z-[200000] flex items-center gap-2 fixed top-4  right-10 text-sm text max-w-[300px] w-full ${styles} text-center p-4 rounded-md border border-gray-200 z-50 animate-toast-in-out`}
        >
            {
                type === "success" ?
                    <IoCheckmarkOutline size={24} color='white' /> :
                    type === "error" ?
                        <IoIosLock size={24} color='white' /> :
                        <AiFillInfoCircle size={24} color='white' />
            }
            <span>{message}</span>
        </div>
    );
};

type ToastContextType = {
    showToast: (message: string, type: string, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toast, setToast] = useState<{ message: string; duration: number; type: string } | null>(null);

    const showToast = (message: string, type: string = "success", duration: number = 3000) => {
        setToast({ message, duration, type });
    };

    const hideToast = () => {
        setToast(null);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <Toast
                    message={toast.message}
                    duration={toast.duration}
                    onClose={hideToast}
                    type={toast.type}
                />
            )}
        </ToastContext.Provider>
    );
};
