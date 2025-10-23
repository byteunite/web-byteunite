"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";

interface ImageDropzoneProps {
    onImageUpload: (file: File) => void;
    imagePreview: string | null;
    setImagePreview: (preview: string | null) => void;
}

export function ImageDropzone({
    onImageUpload,
    imagePreview,
    setImagePreview,
}: ImageDropzoneProps) {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles && acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                onImageUpload(file);
                setImagePreview(URL.createObjectURL(file));
            }
        },
        [onImageUpload, setImagePreview]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: false,
    });

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setImagePreview(null);
    };

    return (
        <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors mt-3 ${
                isDragActive
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
            }`}
        >
            <input {...getInputProps()} />
            {imagePreview ? (
                <>
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-md"
                    />
                    <button
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-background rounded-full p-1 shadow-md"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                    <UploadCloud className="w-12 h-12" />
                    <p className="font-semibold">
                        {isDragActive
                            ? "Drop the image here..."
                            : "Drag & drop an image here, or click to select"}
                    </p>
                    <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
                </div>
            )}
        </div>
    );
}
