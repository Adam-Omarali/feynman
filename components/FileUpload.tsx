"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { Upload, File } from "lucide-react";
import { storage } from "@/firebase/clientConfig";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { toast } from "sonner";
import Link from "next/link";
import { store } from "@/redux/store";

interface FileUploadProps {
  userId: string;
  path: string;
}

interface Resource {
  name: string;
  url: string;
}

export default function FileUpload({ userId, path }: FileUploadProps) {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchResources();
  }, [userId, path]);

  const fetchResources = async () => {
    try {
      const storageRef = ref(storage, `${userId}/${path}`);
      const result = await listAll(storageRef);

      const resourcePromises = result.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return {
          name: item.name,
          url,
        };
      });

      const resourceList = await Promise.all(resourcePromises);
      setResources(resourceList);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleUpload = async () => {
    if (!file || !fileName) {
      toast.error("Please select a file and enter a name");
      return;
    }

    const { storageUsed, maxStorage } = store.getState().user;
    if (storageUsed + file.size > (maxStorage || 0)) {
      toast.error("Upload failed: Storage limit exceeded");
      return;
    }

    try {
      const storageRef = ref(storage, `${userId}/${path}/${fileName}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // Update storage usage
      await fetch("/api/updateStorageUsage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          bytes: file.size,
        }),
      });

      toast.success("File uploaded successfully");
      setFile(null);
      setFileName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      fetchResources(); // Refresh the resource list
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-4 mb-8">
      <h3 className="text-lg font-semibold mb-2">Resources</h3>
      {resources.length > 0 ? (
        <div className="flex flex-wrap gap-4 mb-4">
          {resources.map((resource, index) => (
            <Link
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <File className="h-4 w-4" />
              <span>{resource.name}</span>
            </Link>
          ))}
        </div>
      ) : null}
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <Button variant="outline" size="sm" onClick={handleButtonClick}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Resources
        </Button>
        {file && (
          <>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name"
              className="px-2 py-1 border rounded"
            />
            <Button onClick={handleUpload} size="sm">
              Upload
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
