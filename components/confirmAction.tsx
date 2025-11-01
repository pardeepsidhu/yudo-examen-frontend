import React from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

export const confirmAction = (title: string, warm?: string) =>
  new Promise((resolve) => {
    toast.custom((t) => (
      <div
        className={`
          relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
          rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-4
          border border-pink-200 dark:border-cyan-500/30
          min-w-[320px] text-center animate-in fade-in zoom-in-95 z-[999999]!
        `}
      >
        {/* Accent ring animation */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-300/10 via-cyan-300/10 to-yellow-300/10 pointer-events-none"></div>

        {/* Title */}
        <span className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
          {title}
        </span>

        {/* Warning (optional) */}
        {warm && (
          <span className="text-red-500 font-medium text-sm tracking-wide">
            {warm}
          </span>
        )}

        {/* Buttons */}
        <div className="flex gap-4 mt-2">
          <Button
            onClick={() => {
              toast.dismiss(t.id);
              resolve(true);
            }}
            className="bg-gradient-to-r from-pink-500 via-cyan-500 to-yellow-500 text-white font-medium px-6 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            Yes
          </Button>

          <Button
            onClick={() => {
              toast.dismiss(t.id);
              resolve(false);
            }}
            variant="outline"
            className="border-2 border-cyan-400 text-cyan-500 bg-white/60 dark:bg-gray-800/50 hover:bg-cyan-50 dark:hover:bg-gray-700/70 px-6 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105"
          >
            No
          </Button>
        </div>
      </div>
    ));
  });
