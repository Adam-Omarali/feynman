import { Button } from "@/components/ui/Button";
import Link from "next/link";
import React from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              The Feynman Method
            </h1>
            <p className="text-xl text-gray-600">
              We believe that you are your own best teacher.
            </p>
            <p className="text-xl text-gray-600">
              Richard Feynman was a physicist who found ways to explain things
              at their most basic level, a true hallmark of a genius.
            </p>
            <p className="text-xl text-gray-600">
              Create your own courses, collect you're favourite organic
              chemistry tutor videos, and store the questions that help you
              learn the most.
            </p>
            <Button>
              <Link href="/app">Start Using Feynman Today</Link>
            </Button>
          </div>

          <div className="flex-1">
            <img
              src="/feynman.png"
              alt="Richard Feynman at chalkboard"
              className="rounded-lg shadow-xl w-full object-cover"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
