import React from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ColorPalette } from "@/app/context/theme.context";

export const confirmAction = (title: string, theme: ColorPalette,warm?:string) =>
  new Promise((resolve) => {
    toast.custom((t) => (
      <div 
        className="bg-background shadow-lg rounded-lg p-6 flex flex-col items-center gap-4 min-w-[320px]"
        style={{ 
          border: `1px solid ${theme.primary}20`,
          boxShadow: `0 4px 6px -1px ${theme.primary}10, 0 2px 4px -1px ${theme.primary}10`
        }}
      >
        <span className="text-foreground font-medium text-lg">{title}</span>
       {warm && <span className="text-foreground font-medium text-lg text-red-500">{warm}</span> }
        <div className="flex gap-4 w-full justify-center">
          <Button
            onClick={() => {
              toast.dismiss(t.id);
              resolve(true);
            }}
            size="default"
            style={{ 
              backgroundColor: theme.primary,
              color: 'white',
              padding: '0.5rem 1.5rem',
              fontSize: '1rem'
            }}
          >
            Yes
          </Button>
          <Button
            onClick={() => {
              toast.dismiss(t.id);
              resolve(false);
            }}
            size="default"
            variant="outline"
            style={{ 
              borderColor: theme.primary,
              color: theme.primary,
              backgroundColor: `${theme.primary}10`,
              padding: '0.5rem 1.5rem',
              fontSize: '1rem'
            }}
          >
            No
          </Button>
        </div>
      </div>
    ));
  });

