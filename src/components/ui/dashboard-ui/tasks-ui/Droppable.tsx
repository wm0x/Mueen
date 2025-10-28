"use client";
import { AnimatePresence, motion } from "motion/react";
import { File, Trash2, Upload, XCircle } from "lucide-react";
import type React from "react";
import { type DragEvent, useRef, useState, useEffect } from "react";

interface FileWithPreview extends File {
  preview: string;
}

interface FileDropzoneProps {
  value: File[];
  onChange: (files: File[]) => void;
  onBlur?: () => void;
}

export function FileDropzone({ value = [], onChange, onBlur }: FileDropzoneProps) {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_FILE_COUNT = 5;

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with form value
  useEffect(() => {
    setFiles(value.map(file => 
      Object.assign(file, { preview: URL.createObjectURL(file) })
    ));
  }, [value]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    onBlur?.();

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFiles = (fileList: File[]) => {
    setError(null);

    const existingFileNames = value.map((file) => file.name);
    const newFilesToAdd: File[] = [];
    const duplicateFileNames: string[] = [];
    const oversizedFileNames: string[] = [];
    const invalidTypeFileNames: string[] = [];
    const maxCountExceededNames: string[] = [];

    const availableSlots = MAX_FILE_COUNT - value.length;
    let filesToProcess = fileList;

    if (fileList.length > availableSlots) {
        maxCountExceededNames.push(...fileList.slice(availableSlots).map(f => f.name));
        filesToProcess = fileList.slice(0, availableSlots); 
    }

    filesToProcess.forEach((file) => {
      const isValidType = 
        file.type.startsWith('image/') ||
        file.type === 'application/pdf' ||
        file.type === 'application/msword' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.endsWith('.doc') ||
        file.name.endsWith('.docx');

      if (!isValidType) {
        invalidTypeFileNames.push(file.name);
      } else if (existingFileNames.includes(file.name)) {
        duplicateFileNames.push(file.name);
      } else if (file.size > MAX_FILE_SIZE) {
        oversizedFileNames.push(file.name);
      } else {
        newFilesToAdd.push(file);
      }
    });

    let errorMessage = "";
    
    if (maxCountExceededNames.length > 0) {
        errorMessage += `لا يمكن رفع ${maxCountExceededNames.length} ملفات إضافية. الحد الأقصى لعدد الملفات هو ${MAX_FILE_COUNT}. `;
    }

    if (invalidTypeFileNames.length > 0) {
      errorMessage += `لم يتم رفع ${invalidTypeFileNames.length} ملفات لأن نوعها غير مدعوم. الملفات المسموحة: الصور، PDF، Word. `;
    }

    if (duplicateFileNames.length > 0) {
      errorMessage += `لم يتم رفع ${duplicateFileNames.length} ملفات لأنها موجودة بالفعل: ${duplicateFileNames.join(", ")}. `;
    }

    if (oversizedFileNames.length > 0) {
      const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
      errorMessage += `لم يتم رفع ${oversizedFileNames.length} ملفات لتجاوزها الحد الأقصى (${maxSizeMB}MB).`;
    }

    if (errorMessage) {
      setError(errorMessage.trim());
    }

    if (newFilesToAdd.length > 0) {
      const updatedFiles = [...value, ...newFilesToAdd];
      onChange(updatedFiles);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const handleDeleteFile = (fileToDelete: FileWithPreview) => {
    const updatedFiles = value.filter((file) => file !== fileToDelete);
    onChange(updatedFiles);
    URL.revokeObjectURL(fileToDelete.preview);
  };

  return (
    <div className="w-full space-y-4"> {/* Removed fixed padding and height */}
      <motion.div
        className={`relative w-full cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-500/5"
            : "border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-500"
        }`}
        onClick={handleButtonClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.doc,.docx"
          className="hidden"
          multiple={true}
          onChange={handleFileInputChange}
          ref={fileInputRef}
          type="file"
        />
        <AnimatePresence>
          {isDragActive ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-none select-none w-full"
              exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Upload className="pointer-events-none mx-auto size-8 select-none text-blue-500" />
              <p className="pointer-events-none mt-2 select-none text-blue-500 text-sm">
                ضع الملف هنا 
              </p>
            </motion.div>
          ) : (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              initial={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Upload className="mx-auto size-8 text-neutral-400 dark:text-neutral-500" />
              <p className="mt-2 text-balance font-medium text-neutral-400 text-sm tracking-tighter dark:text-neutral-500">
                اسحب الملفات هنا أو اضغط لاختيارها
              </p>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                الملفات المسموحة: الصور، PDF، Word (الحد الأقصى: {MAX_FILE_COUNT} ملفات، {MAX_FILE_SIZE / (1024 * 1024)}MB لكل ملف)
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            initial={{ opacity: 0, y: -10 }}
            className="flex items-center rounded-lg border border-red-400 bg-red-50/50 p-3 text-sm text-red-700 dark:border-red-600 dark:bg-red-900/10 dark:text-red-400"
            role="alert"
          >
            <XCircle className="mr-2 size-5 flex-shrink-0" />
            <p className="flex-1 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-2 w-full"
            exit={{ opacity: 0, height: 0 }}
            initial={{ opacity: 0, height: 0 }}
          >
            {files.map((file) => (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between px-4 rounded-lg bg-neutral-400/10 p-1"
                exit={{ opacity: 0, x: 20 }}
                initial={{ opacity: 0, x: -20 }}
                key={file.name}
              >
                {file.type.startsWith("image/") ? (
                  <img
                    alt={file.name}
                    className="mr-2 size-10 rounded-xs object-cover"
                    src={file.preview}
                  />
                ) : (
                  <File className="mr-2 size-10 text-neutral-500" />
                )}
                <span className="flex-1 truncate text-neutral-600 text-xs tracking-tighter dark:text-neutral-400 max-w-xs">
                  {file.name}
                </span>
                <Trash2
                  className="mr-2 size-5 cursor-pointer text-red-500 transition-colors hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(file);
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FileDropzone;