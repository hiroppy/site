"use client";

import { useEffect } from "react";
import { Button } from "../components/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-6">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            エラーが発生しました
          </h1>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-left">
            <p className="mb-2 font-mono text-sm text-red-800">
              {error.message}
            </p>
            {error.digest && (
              <p className="font-mono text-xs text-red-600">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => reset()}>再試行</Button>
          <Button href="/" variant="outline">
            ホームに戻る
          </Button>
        </div>
      </div>
    </div>
  );
}
