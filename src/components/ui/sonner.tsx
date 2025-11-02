'use client';
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps, toast } from "sonner";
import React from "react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      dir="rtl"
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--success-bg": "#059669",
          "--error-bg": "#dc2626",
          "--warning-bg": "#d97706",
          "--info-bg": "#1d4ed8",
          "--success-text": "#ffffff",
          "--error-text": "#ffffff",
          "--warning-text": "#ffffff",
          "--info-text": "#ffffff",
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "12px",
          "--font-weight": "600",
        } as React.CSSProperties
      }
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: "group toast-group !border-0 !shadow-xl !rounded-2xl !font-sans",
          title: "!font-bold !text-sm", 
          description: "!font-medium !text-xs !opacity-90", 
          actionButton: "!font-bold !bg-white/30 !text-white hover:!bg-white/40",
          cancelButton: "!font-medium !bg-white/10 !text-white",
          closeButton: "!bg-transparent !border-0 !text-white/80 hover:!text-white",
          
          success: "!bg-gradient-to-br !from-emerald-500 !to-green-700 !text-white !shadow-xl !shadow-emerald-500/35",
          
          error: "!bg-gradient-to-br !from-red-500 !to-rose-700 !text-white !shadow-xl !shadow-red-500/35",
          
          warning: "!bg-gradient-to-br !from-amber-500 !to-orange-700 !text-white !shadow-xl !shadow-amber-500/35",
          
          info: "!bg-gradient-to-br !from-blue-500 !to-indigo-700 !text-white !shadow-xl !shadow-blue-500/35",
          
          loading: "!bg-gradient-to-br !from-gray-600 !to-gray-800 !text-white !shadow-lg",
        },
      }}
      {...props}
    />
  );
};

export const toastSuccess = (message: string, description?: string) => {
  toast.success(message, {
    description,
    duration: 3000,
  });
};

export const toastError = (message: string, description?: string) => {
  toast.error(message, {
    description,
    duration: 5000,
  });
};

export const toastWarning = (message: string, description?: string) => {
  toast.warning(message, {
    description,
    duration: 4000,
  });
};

export const toastInfo = (message: string, description?: string) => {
  toast.info(message, {
    description,
    duration: 3000,
  });
};

export const toastLoading = (message: string, description?: string) => {
  return toast.loading(message, {
    description,
  });
};

export const toastPromise = <T,>(
  promise: Promise<T>,
  options: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  }
) => {
  return toast.promise(promise, options);
};

export { Toaster };
