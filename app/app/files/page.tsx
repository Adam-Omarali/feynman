"use client";

import FileManager from "@/components/FileManager";

export default function FilesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">File Management</h1>
      <FileManager />
    </div>
  );
}
