"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ArrowUpRight, File, Book } from "lucide-react";
import { UserState } from "@/redux/user";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const COURSE_LIMITS = {
  free: 3,
  pro: 100,
};

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.user) as UserState;
  const [subscription, setSubscription] = useState("free");

  const { data: subscriptionData } = useQuery({
    queryKey: ["subscription", user.id],
    queryFn: async () => {
      if (user?.subscription) {
        return { subscription: user.subscription };
      }
      const response = await fetch("/api/setDefaultSubscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await response.json();
      return data;
    },
    enabled: !!user.id,
  });

  useEffect(() => {
    if (subscriptionData?.subscription) {
      setSubscription(subscriptionData.subscription);
    }
  }, [subscriptionData]);

  const formatStorage = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Plan</span>
                <span
                  className={`text-sm font-normal px-3 py-1 rounded-full ${
                    subscription === "pro"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {subscription.charAt(0).toUpperCase() + subscription.slice(1)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                {subscription === "pro"
                  ? "You have access to all pro features."
                  : "Upgrade to Pro for unlimited courses and storage."}
              </p>
              {subscription !== "pro" && (
                <Link
                  href={
                    process.env.NEXT_PUBLIC_PRO_SUBSCRIPTION_LINK! +
                    "?prefilled_email=" +
                    user.email
                  }
                  target="_blank"
                >
                  <Button className="w-full">
                    Upgrade to Pro
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Book className="h-5 w-5 mr-2 text-gray-500" />
                  <span>Courses Created</span>
                </div>
                <span className="font-medium">
                  {Object.keys(user.courses).length} /{" "}
                  {COURSE_LIMITS[subscription as keyof typeof COURSE_LIMITS]}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <File className="h-5 w-5 mr-2 text-gray-500" />
                  <span>Storage Used</span>
                </div>
                <span className="font-medium">
                  {formatStorage(user.storageUsed)} /{" "}
                  {formatStorage(user.maxStorage || 0)}
                </span>
              </div>
              <Link
                href={
                  process.env.NEXT_PUBLIC_STORAGE_PAYMENT_LINK! +
                  "?prefilled_email=" +
                  user.email
                }
                target="_blank"
              >
                <Button className="w-full">
                  Get More Storage
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
