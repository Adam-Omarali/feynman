import CourseGallery from "@/components/CourseGallery";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feynman",
  description: "Feynman is a platform for helping you teach yourself",
};

export default function Home() {
  return (
    <div className="p-4">
      <p className="text-xl font-semibold pb-2">Courses</p>
      <CourseGallery />
    </div>
  );
}
