"use client";

import React, { useState } from "react";
import AceEditor from "react-ace";
import {
  Play,
  Code2,
  Terminal,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useTheme } from "../../context/theme.context";
import axios from "axios";
import toast from "react-hot-toast";

// Import language modes
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-rust";
import "ace-builds/src-noconflict/mode-swift";

// Import themes
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";

// Enable autocomplete
import "ace-builds/src-noconflict/ext-language_tools";

export const CodeRunner = ({
  code,
  language,
}: {
  code: string;
  language: string;
}) => {
  const { theme } = useTheme();
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const editorValue = code;
  const handleRunCode = async () => {
    if (!code) {
      toast.error("Please enter code!");
      return;
    }
    setIsLoading(true);
    setError("");
    setOutput("");
    toast.loading("Running code...");

    try {
      const res = await axios.post(
        "https://onecompiler-apis.p.rapidapi.com/api/v1/run",
        {
          language,
          files: [{ name: `Main.${language}`, content: code }],
        },
        {
          headers: {
            "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
            "x-rapidapi-host": "onecompiler-apis.p.rapidapi.com",
            "Content-Type": "application/json",
          },
        }
      );


      let result = "";
      if (res.data.stdout) {
        result = res.data.stdout;
      } else if (res.data.stderr) {
        result = res.data.stderr;
      } else {
        result = "No output";
      }

      // Format the output to handle special characters and line breaks
      const formattedOutput = result
        .replace(/\\n/g, "\n")
        .replace(/\\t/g, "\t")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\")
        .trim();

      setOutput(formattedOutput);

      toast.dismiss();
      toast.success("Execution completed!");
    } catch (error) {
      console.error("Error running code:", error);
      setError("Failed to execute code. Please try again.");
      toast.dismiss();
      toast.error("Execution failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="rounded-2xl sm:rounded-xl overflow-hidden border"
      style={{
        borderColor: `${theme.primary}22`,
        background: theme.white,
      }}
    >
      <div className="p-1 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 mb-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Code2
              className="h-6 w-6 sm:h-8 sm:w-8"
              style={{ color: theme.primary }}
            />
            <h2
              className="text-base sm:text-lg md:text-xl font-bold"
              style={{ color: theme.primary }}
            >
              Code Editor
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={handleRunCode}
              disabled={isLoading}
              className="w-full sm:w-auto px-4 sm:px-5 py-2 rounded-md text-white text-sm font-semibold hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: theme.primary }}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span className="sm:hidden">Run</span>
              <span className="hidden sm:inline">Run Code</span>
            </button>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div
            className="rounded-lg sm:rounded-xl overflow-hidden border"
            style={{ borderColor: `${theme.primary}22`, background: theme.white }}
          >
            <AceEditor
              mode={language}
              theme="github"
              value={editorValue}
              name="aceCodeEditor"
              editorProps={{ $blockScrolling: true }}
              enableBasicAutocompletion={true}
              enableLiveAutocompletion={true}
              enableSnippets={true}
              fontSize={13}
              style={{
                borderRadius: "8px",
                width: "100%",
                minHeight: "350px",
                maxHeight: "550px",
                fontFamily: "Fira Mono, Menlo, Monaco, Consolas, monospace",
                background: theme.white,
              }}
              width="100%"
              height="200px"
              showPrintMargin={false}
              showGutter={true}
              highlightActiveLine={true}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
              }}
            />
          </div>

          {(output || error) && (
            <div
              className="rounded-lg sm:rounded-xl overflow-hidden border"
              style={{ borderColor: `${theme.primary}22`, background: theme.white }}
            >
              <div
                className="px-4 sm:px-6 py-2 sm:py-3 border-b flex items-center gap-2"
                style={{
                  borderColor: `${theme.primary}22`,
                  background: theme.neutral,
                }}
              >
                <Terminal
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  style={{ color: theme.primary }}
                />
                <span
                  className="text-sm sm:text-base font-medium"
                  style={{ color: theme.primary }}
                >
                  Output
                </span>
              </div>
              <div className="p-3 sm:p-5 bg-white max-h-60 overflow-y-auto">
                {error ? (
                  <div className="flex items-start gap-2 text-red-600">
                    <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <pre className="text-xs sm:text-sm whitespace-pre-wrap">{error}</pre>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-gray-700">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <pre className="text-xs sm:text-sm whitespace-pre-wrap">{output}</pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

