"use client";

import React, {  useState } from "react";
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



export const CodeRunner = ({code,language}:{code:string,language:string}) => {
  const { theme } = useTheme();
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const editorValue = code


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
            "x-rapidapi-key": "c075844e09msh7ee8aeb9f4f3874p1d8484jsnc3ea092df37f",
            "x-rapidapi-host": "onecompiler-apis.p.rapidapi.com",
            "Content-Type": "application/json",
          },
        }
      );

      // Handle both stdout and stderr
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
        .replace(/\\n/g, '\n')  // Replace \n with actual line breaks
        .replace(/\\t/g, '\t')  // Replace \t with actual tabs
        .replace(/\\"/g, '"')   // Replace \" with actual quotes
        .replace(/\\\\/g, '\\') // Replace \\ with actual backslashes
        .trim();                // Remove extra whitespace

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
    <div className="bg-white rounded-2xl sm:rounded-xl overflow-hidden border border-gray-100">
      <div className="p-4 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Code2 className="h-6 w-6 sm:h-8 sm:w-8" style={{ color: theme.primary }} />
            <h2 className="text-md sm:text-xl font-bold text-gray-900">Code Editor</h2>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
  

            <button
              onClick={handleRunCode}
              disabled={isLoading}
              className="px-4 sm:px-5 py-2 sm:py-2 rounded-sm sm:rounded-md text-white text-sm font-sm hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{ backgroundColor: theme.primary }}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <p className="sm:hidden">Run</p>
              <p className="hidden sm:flex text-nowrap">Run Code</p>
            </button>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div className="rounded-lg p-4 sm:rounded-xl overflow-hidden border border-gray-200">
            <AceEditor
              mode={language}
              theme="github"
              value={editorValue}
              name="aceCodeEditor"
              editorProps={{ $blockScrolling: true }}
              enableBasicAutocompletion={true}
              enableLiveAutocompletion={true}
              enableSnippets={true}
              fontSize={14}
              style={{ borderRadius: "8px" }}
              width="100%"
              height="400px"
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
            <div className="rounded-lg sm:rounded-xl overflow-hidden border border-gray-200">
              <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center gap-2">
                <Terminal className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                <span className="text-sm sm:text-base font-medium text-gray-700">Output</span>
              </div>
              <div className="p-4 sm:p-6 bg-white max-h-100 overflow-y-auto">
                {error ? (
                  <div className="flex items-start gap-2 text-red-600">
                    <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <pre className="text-sm sm:text-base whitespace-pre-wrap">{error}</pre>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-gray-700">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <pre className="text-sm sm:text-base whitespace-pre-wrap">{output}</pre>
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

