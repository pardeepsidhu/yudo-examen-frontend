"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import AceEditor from "react-ace";
import {
  Play,
  Code2,
  Terminal,
  Loader2,
  CheckCircle2,
  XCircle,
  Maximize2,
  X,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  GripHorizontal,
} from "lucide-react";
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
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showOutput, setShowOutput] = useState(true);
  const [outputWidth, setOutputWidth] = useState(384); // 384px = w-96
  const [outputHeight, setOutputHeight] = useState(256); // 256px for mobile
  const [isResizing, setIsResizing] = useState(false);
  const editorValue = code;

  const resizeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle resizing
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth >= 1024) {
        // Desktop: resize width from right
        const newWidth = window.innerWidth - e.clientX;
        setOutputWidth(Math.max(200, Math.min(800, newWidth)));
      } else {
        // Mobile: resize height from bottom
        const newHeight = window.innerHeight - e.clientY;
        setOutputHeight(Math.max(150, Math.min(600, newHeight)));
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = window.innerWidth >= 1024 ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [isResizing]);

  const handleRunCode = async () => {
    if (!code) {
      toast.error("Please enter code!");
      return;
    }
    setIsLoading(true);
    setError("");
    setOutput("");
    setShowOutput(true);
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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const clearOutput = () => {
    setOutput("");
    setError("");
    toast.success("Output cleared!");
  };

  const toggleOutputVisibility = () => {
    setShowOutput(!showOutput);
  };

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const renderOutputPanel = (isFullscreenMode: boolean) => {
    if (!output && !error) return null;

    return (
      <div className="flex flex-col h-full">
        {/* Output Header - Always visible */}
        <div className="flex-shrink-0 px-4 sm:px-6 py-3 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-sm bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
              <Terminal className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
              Output
            </span>
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Running...</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isFullscreenMode && (
              <button
                onClick={toggleOutputVisibility}
                className="p-2 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title={showOutput ? "Hide output" : "Show output"}
              >
                {showOutput ? (
                  <EyeOff className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            )}
            <button
              onClick={clearOutput}
              className="p-2 rounded-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
              title="Clear output"
            >
              <Trash2 className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
            </button>
          </div>
        </div>

        {/* Output Content - Conditionally visible */}
        {showOutput && (
          <div className="flex-1 p-2 sm:p-4 bg-white dark:bg-gray-900 overflow-y-auto">
            {error ? (
              <div className="flex items-start gap-3  rounded-sm  ">
                <div className="p-1 rounded-full bg-red-500 flex-shrink-0">
                  <XCircle className="h-4 w-4 text-white" />
                </div>
                <pre className="text-xs sm:text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap flex-1 font-mono">
                  {error}
                </pre>
              </div>
            ) : (
              <div className="flex items-start gap-3  rounded-sm  ">
                <div className="p-1 rounded-full bg-green-500 flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
                <pre className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap flex-1 font-mono">
                  {output}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderFullscreenContent = () => (
    <div className="fixed inset-0 z-[99999] bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Fullscreen Header */}
      <div className="flex-shrink-0 p-3 sm:p-4 border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex flex-row items-start items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-sm bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <Code2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-gray-100">
                Code Editor
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                Fullscreen Mode • {language.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-auto">
            <button
              onClick={handleRunCode}
              disabled={isLoading}
              className="sm:flex-1 sm:flex-none px-5 sm:px-6 py-[11px] rounded-sm bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />

                  <span className="hidden sm:block">Running...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span className="hidden sm:block" >Run Code</span>
                </>
              )}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2.5 sm:p-3 rounded-sm bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
              title="Exit fullscreen"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Content - Desktop: Side by side, Mobile: Stacked */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Editor Section */}
        <div className="flex-1 p-0 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 rounded-0 overflow-hidden border-2 border-blue-200 dark:border-gray-700 shadow-lg min-h-0">
            <AceEditor
              mode={language}
              theme="github"
              value={editorValue}
              name="aceCodeEditorFullscreen"
              editorProps={{ $blockScrolling: true }}
              enableBasicAutocompletion={true}
              enableLiveAutocompletion={true}
              enableSnippets={true}
              fontSize={14}
              style={{
                borderRadius: "0px",
                width: "100%",
                height: "100%",
                fontFamily: "Fira Mono, Menlo, Monaco, Consolas, monospace",
              }}
              width="100%"
              height="100%"
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
        </div>

        {/* Resize Handle - Desktop (Vertical) */}
        {showOutput && (output || error) && (
          <div
            className="hidden lg:flex items-center justify-center w-2 bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-600 cursor-col-resize transition-colors group relative"
            onMouseDown={startResize}
            ref={resizeRef}
          >
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-gray-400 dark:bg-gray-500 group-hover:bg-blue-500 transition-colors"></div>
            <GripVertical className="absolute h-8 w-8 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}

        {/* Output Section - Right side on desktop, bottom on mobile */}
        {(output || error) && (
          <div
            className="flex-shrink-0 border-t-2 lg:border-t-0 lg:border-l-0 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 flex flex-col"
            style={{
              width: showOutput && window.innerWidth >= 1024 ? `${outputWidth}px` : showOutput ? 'auto' : 'auto',
              height: showOutput && window.innerWidth < 1024 ? `${outputHeight}px` : showOutput ? 'auto' : '56px',
            }}
          >
            {/* Desktop Collapsed Sidebar */}
            {!showOutput && (
              <>
                {/* Mobile: Header bar when collapsed */}
                <div className="flex lg:hidden items-center justify-between px-4 py-3 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-sm bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                      <Terminal className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      Output (Hidden)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleOutputVisibility}
                      className="p-1.5 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      title="Show output"
                    >
                      <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={clearOutput}
                      className="p-1.5 rounded-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                      title="Clear output"
                    >
                      <Trash2 className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Desktop: Vertical sidebar when collapsed */}
                <div className="hidden lg:flex flex-col items-center justify-between h-full py-6 px-3 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
                  <div className="flex flex-col items-center gap-6">
                    <div className="p-2 rounded-sm bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                      <Terminal className="h-5 w-5 text-white" />
                    </div>

                    <div className="h-px w-8 bg-gray-300 dark:bg-gray-600"></div>

                    <button
                      onClick={toggleOutputVisibility}
                      className="p-2.5 rounded-sm hover:bg-white dark:hover:bg-gray-700 transition-all hover:scale-110 shadow-sm"
                      title="Show output"
                    >
                      <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </button>

                    <button
                      onClick={clearOutput}
                      className="p-2.5 rounded-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all hover:scale-110 shadow-sm group"
                      title="Clear output"
                    >
                      <Trash2 className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
                    </button>
                  </div>

                  {/* Vertical "OUTPUT" text */}
                  <div className="flex items-center justify-center mt-2">
                    <span className="text-xs font-black text-gray-400 dark:text-gray-500 tracking-wider [writing-mode:vertical-rl] rotate-180">
                      OUTPUT
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Expanded State - Full Panel */}
            {showOutput && renderOutputPanel(true)}
          </div>
        )}

        {/* Resize Handle - Mobile (Horizontal) */}
        {showOutput && (output || error) && (
          <div
            className="flex lg:hidden items-center justify-center h-2 bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-600 cursor-row-resize transition-colors group relative"
            onMouseDown={startResize}

            style={{ touchAction: 'none' }}
          >
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-gray-400 dark:bg-gray-500 group-hover:bg-blue-500 transition-colors"></div>
            <GripHorizontal className="absolute h-8 w-8 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="rounded-xl overflow-hidden border-2 border-blue-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-xl">
        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex flex-col flex-row items-start items-center justify-between gap-3 sm:gap-6 mb-4 p-3 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-sm bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <Code2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-gray-100">
                Code Editor
              </h2>
            </div>

            <div className="flex items-center gap-2 w-auto">
              <button
                onClick={handleRunCode}
                disabled={isLoading}
                className="flex-1 sm:flex-none px-5 sm:px-6 py-2.5 rounded-sm bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline" >Running...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span className="hidden sm:inline">Run Code</span>
                  </>
                )}
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2.5 rounded-sm bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                title="Fullscreen"
              >
                <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5" />
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
                  borderRadius: "4px",
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

            {(output || error) && renderOutputPanel(false)}
          </div>
        </div>
      </div>

      {/* Portal for fullscreen */}
      {mounted && isFullscreen && createPortal(renderFullscreenContent(), document.body)}
    </>
  );
};