'use client';

import { useCallback } from 'react';

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

interface ShareOptions {
  fallbackToClipboard?: boolean;
  showSuccessMessage?: boolean;
}

export function useNativeShare() {
  const isShareSupported = useCallback((): boolean => {
    return typeof navigator !== 'undefined' && 'share' in navigator;
  }, []);

  const canShareFiles = useCallback((): boolean => {
    return typeof navigator !== 'undefined' && 
           'canShare' in navigator && 
           typeof navigator.canShare === 'function';
  }, []);

  const shareData = useCallback(async (
    data: ShareData, 
    options: ShareOptions = {}
  ): Promise<boolean> => {
    const { fallbackToClipboard = true, showSuccessMessage = true } = options;

    try {
      // Check if native sharing is supported
      if (!isShareSupported()) {
        if (fallbackToClipboard && data.text) {
          return await copyToClipboard(data.text, showSuccessMessage);
        }
        throw new Error('Sharing not supported');
      }

      // Check if we can share files
      if (data.files && data.files.length > 0) {
        if (!canShareFiles()) {
          throw new Error('File sharing not supported');
        }

        // Check if the specific files can be shared
        if (navigator.canShare && !navigator.canShare({ files: data.files })) {
          throw new Error('These files cannot be shared');
        }
      }

      // Attempt to share
      await navigator.share(data);
      
      // Trigger haptic feedback on success
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }

      return true;
    } catch (error) {
      console.error('Share failed:', error);
      
      // Fallback to clipboard if available
      if (fallbackToClipboard && data.text && error instanceof Error && error.name !== 'AbortError') {
        return await copyToClipboard(data.text, showSuccessMessage);
      }
      
      return false;
    }
  }, [isShareSupported, canShareFiles]);

  const shareFile = useCallback(async (
    file: File, 
    title?: string,
    text?: string
  ): Promise<boolean> => {
    return await shareData({
      title,
      text,
      files: [file]
    });
  }, [shareData]);

  const shareText = useCallback(async (
    text: string,
    title?: string
  ): Promise<boolean> => {
    return await shareData({
      title,
      text
    });
  }, [shareData]);

  const shareUrl = useCallback(async (
    url: string,
    title?: string,
    text?: string
  ): Promise<boolean> => {
    return await shareData({
      title,
      text,
      url
    });
  }, [shareData]);

  return {
    shareData,
    shareFile,
    shareText,
    shareUrl,
    isShareSupported: isShareSupported(),
    canShareFiles: canShareFiles()
  };
}

// Helper function to copy text to clipboard
async function copyToClipboard(text: string, showMessage: boolean = true): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    if (showMessage) {
      // You could show a toast notification here
      console.log('Copied to clipboard');
    }

    // Trigger haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}