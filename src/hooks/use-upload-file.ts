import * as React from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { supabase } from '@/lib/supabaseClient';

export type UploadedFile = {
  key: string;
  path: string;
  appUrl: string;
  name: string;
  size: number;
  type: string;
  url: string;
};

interface UseUploadFileProps {
  bucket?: string;
  pathPrefix?: string;
  onUploadComplete?: (file: UploadedFile) => void;
  onUploadError?: (error: unknown) => void;
}

const DEFAULT_BUCKET =
  (import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'images').trim();
const DEFAULT_PREFIX =
  (import.meta.env.VITE_SUPABASE_STORAGE_PREFIX || 'projects').trim();

export function useUploadFile({
  bucket,
  pathPrefix = DEFAULT_PREFIX,
  onUploadComplete,
  onUploadError,
}: UseUploadFileProps = {}) {
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile>();
  const [uploadingFile, setUploadingFile] = React.useState<File>();
  const [progress, setProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState(false);

  async function uploadThing(file: File) {
    setIsUploading(true);
    setUploadingFile(file);
    setProgress(8);

    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const storageBucket = (bucket || DEFAULT_BUCKET || 'images').trim();
      if (!storageBucket) {
        throw new Error('Missing storage bucket. Set VITE_SUPABASE_STORAGE_BUCKET.');
      }

      const cleanPrefix =
        (pathPrefix ?? DEFAULT_PREFIX ?? '').replace(/^\/+|\/+$/g, '') || '';

      const extension = file.name.includes('.') ? file.name.split('.').pop() : '';
      const randomName = `${Math.random().toString(36).substring(2)}-${Date.now()}${
        extension ? `.${extension}` : ''
      }`;
      const path = cleanPrefix ? `${cleanPrefix}/${randomName}` : randomName;

      const { data, error } = await supabase.storage
        .from(storageBucket)
        .upload(path, file, {
          contentType: file.type || 'application/octet-stream',
        });

      if (error) {
        throw error;
      }

      const { data: publicUrl } = supabase.storage
        .from(storageBucket)
        .getPublicUrl(data?.path ?? path);

      const uploaded: UploadedFile = {
        key: data?.id || data?.path || path,
        path: data?.path || path,
        appUrl: publicUrl.publicUrl,
        name: file.name,
        size: file.size,
        type: file.type,
        url: publicUrl.publicUrl,
      };

      setUploadedFile(uploaded);
      setProgress(100);
      onUploadComplete?.(uploaded);
      return uploaded;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      const message =
        errorMessage.length > 0
          ? `[upload] ${errorMessage}`
          : 'Upload failed, please check bucket name/policies.';
      toast.error(message);

      onUploadError?.(error);
      throw error;
    } finally {
      setProgress(0);
      setIsUploading(false);
      setUploadingFile(undefined);
    }
  }

  return {
    isUploading,
    progress,
    uploadedFile,
    uploadFile: uploadThing,
    uploadingFile,
  };
}

export function getErrorMessage(err: unknown) {
  const unknownError = 'Something went wrong, please try again later.';

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => issue.message);

    return errors.join('\n');
  }
  if (err instanceof Error) {
    return err.message;
  }
  return unknownError;
}

export function showErrorToast(err: unknown) {
  const errorMessage = getErrorMessage(err);

  return toast.error(errorMessage);
}
