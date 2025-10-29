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
  <div className="rounded-xl overflow-hidden border-2 border-blue-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-xl">
  <div className="p-3 sm:p-4 md:p-6">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 mb-4 p-3 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
          <Code2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-gray-100">
          Code Editor
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <button
          onClick={handleRunCode}
          disabled={isLoading}
          className="w-full sm:w-auto px-5 sm:px-6 py-2.5 rounded-lg bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span className="sm:hidden">Run</span>
              <span className="hidden sm:inline">Run Code</span>
            </>
          )}
        </button>
      </div>
    </div>

    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-xl overflow-hidden border-2 border-blue-200 dark:border-gray-700 shadow-lg">
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
            borderRadius: "12px",
            width: "100%",
            minHeight: "350px",
            maxHeight: "550px",
            fontFamily: "Fira Mono, Menlo, Monaco, Consolas, monospace",
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
        <div className="rounded-xl overflow-hidden border-2 border-blue-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
          <div className="px-4 sm:px-6 py-3 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
              <Terminal className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
              Output
            </span>
          </div>
          <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 max-h-60 overflow-y-auto">
            {error ? (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-2 border-red-300 dark:border-red-700">
                <div className="p-1 rounded-full bg-red-500">
                  <XCircle className="h-4 w-4 text-white" />
                </div>
                <pre className="text-xs sm:text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap flex-1 font-mono">{error}</pre>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-2 border-green-300 dark:border-green-700">
                <div className="p-1 rounded-full bg-green-500">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
                <pre className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap flex-1 font-mono">{output}</pre>
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

