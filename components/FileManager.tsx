"use client";

import { useEffect, useState } from "react";
import {
  getStorage,
  ref,
  listAll,
  deleteObject,
  getDownloadURL,
  getMetadata,
} from "firebase/storage";
import { storage } from "@/firebase/clientConfig";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { UserState } from "@/redux/user";
import { Button } from "./ui/Button";
import { Trash2, Download, File, Folder } from "lucide-react";
import { toast } from "sonner";

interface FileItem {
  name: string;
  url: string;
  fullPath: string;
  type: string;
}

export default function FileManager() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.user) as UserState;

  useEffect(() => {
    if (user.id) {
      fetchFiles();
    }
  }, [user.id]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const storageRef = ref(storage, user.id);
      const result = await listAll(storageRef);

      // Get all files in the root directory
      const filePromises = result.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return {
          name: item.name,
          url,
          fullPath: item.fullPath,
          type: item.name.split(".").pop()?.toLowerCase() || "",
        };
      });

      // Get all files in subdirectories
      const subdirPromises = result.prefixes.map(async (prefix) => {
        const subdirRef = ref(storage, prefix.fullPath);
        const subdirResult = await listAll(subdirRef);
        return subdirResult.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return {
            name: item.name,
            url,
            fullPath: item.fullPath,
            type: item.name.split(".").pop()?.toLowerCase() || "",
          };
        });
      });

      const rootFiles = await Promise.all(filePromises);
      const subdirFiles = await Promise.all(
        (await Promise.all(subdirPromises)).flat()
      );

      setFiles([...rootFiles, ...subdirFiles]);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filePath: string) => {
    try {
      const fileRef = ref(storage, filePath);

      // Get file metadata to get the size
      const metadata = await getMetadata(fileRef);
      const fileSize = metadata.size;

      await deleteObject(fileRef);

      // Update storage usage (subtract the file size)
      await fetch("/api/updateStorageUsage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          bytes: -fileSize, // Negative value to subtract from total
        }),
      });

      setFiles(files.filter((file) => file.fullPath !== filePath));
      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  const isImage = (type: string) => {
    return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(type);
  };

  if (loading) {
    return <div className="p-4">Loading files...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Your Files</h2>
      {files.length === 0 ? (
        <p className="text-gray-500">No files found</p>
      ) : (
        <div className="space-y-4">
          {files.map((file) => (
            <div
              key={file.fullPath}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
            >
              <div className="flex items-center space-x-4">
                {isImage(file.type) ? (
                  <div className="flex items-center space-x-4">
                    <div className="relative w-32 h-32">
                      <img
                        src={file.url}
                        alt={file.name}
                        className="object-cover w-full h-full rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            const fallback = document.createElement("div");
                            fallback.className =
                              "w-32 h-32 flex items-center justify-center bg-gray-100 rounded";
                            fallback.innerHTML =
                              '<File class="w-12 h-12 text-gray-400" />';
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    </div>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {file.name}
                    </a>
                  </div>
                ) : (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {file.name}
                  </a>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(file.url, "_blank")}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(file.fullPath)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
