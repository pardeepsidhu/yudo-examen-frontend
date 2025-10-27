"use client";

import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import { 
  Play, 
  Code2, 
  Terminal, 
  Loader2,
  CheckCircle2,
  XCircle,
  Wand2,
  Badge
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
import { Button } from "@/components/ui/button";
import { Question } from "../page";
import { genereateContent } from "@/app/api/ai.api";
import { confirmAction } from "@/components/confirmAction";


export const CodeEditor = ({currentQuestion,setCurrentQuestion}:{currentQuestion?:Question,setCurrentQuestion?: React.Dispatch<React.SetStateAction<Question>>}) => {
  const { theme } = useTheme();
  const [language, setLanguage] = useState(currentQuestion?.codeLang?currentQuestion?.codeLang:"javascript");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Function to extract code from JSON format
  const extractCodeFromJson = (codeInput: string | { response?: string; code?: string } | undefined): string => {
    if (!codeInput) return "";
    
    try {
      // If it's already a string, return it
      if (typeof codeInput === 'string') {
        // Check if it's a JSON string
        if (codeInput.trim().startsWith('{')) {
          try {
            const parsed = JSON.parse(codeInput);
            // Handle both formats: { response: "code" } and { code: "code" }
            if ('response' in parsed) {
              return parsed.response;
            }
            if ('code' in parsed) {
              return parsed.code;
            }
          } catch (e) {
             if(e)
            return codeInput;
          }
        }
        return codeInput;
      }
      
      // If it's an object
      if (typeof codeInput === 'object' && codeInput !== null) {
        if ('response' in codeInput) {
          return codeInput.response || "";
        }
        if ('code' in codeInput) {
          return codeInput.code || "";
        }
      }
      
      return "";
    } catch (error) {
      console.error('Error extracting code:', error);
      return "";
    }
  };

  // Update the AceEditor value prop to use the extracted code
  const editorValue = extractCodeFromJson(currentQuestion?.code);

  /**
   * Generates code based on the current question title and selected language
   * Includes validation, confirmation, and extraction of code from AI response
   */
  const generateCode = async () => {
    // Validate that title exists
    if (!currentQuestion || !currentQuestion.title) {
      toast.error('Please add title first');
      return;
    }
    
    // Confirm language selection with user
    const confirm = await confirmAction(
      "Please ensure to select desired language first", 
      theme, 
      "If selected please continue"
    );
    if(!confirm) return;
    
    setIsGeneratingAI(true);
    
    try {
      // Generate code using AI with explicit formatting instructions
      const res = await genereateContent(
        `Generate well-commented ${language} code for "${currentQuestion.title}".
        
        Must include:
        - Opening comment block explaining purpose and functionality
        - Comments for all functions/methods describing purpose, params, and returns
        - Inline comments for complex logic
        - Follow ${language} best practices
        
        Important: Return only the code with comments, no JSON formatting, no markdown, no extra text.
        Just return the pure code with proper formatting and comments.
        no need wraping code between any type of quotes or backticks.
        and no need writing language on top just write code and comments`
      );

      // Handle different response formats
      if (!res) {
        toast.error("Failed to get a response");
        return;
      }

      let code = res.response || "";
      
      // Clean up the response
      code = code
        .replace(/```json\s*{[\s\S]*?"code":\s*"([\s\S]*?)"[\s\S]*?}\s*```/g, '$1') // Remove JSON wrapper
        .replace(/```javascript\s*([\s\S]*?)```/g, '$1') // Remove markdown code blocks
        .replace(/```\s*([\s\S]*?)```/g, '$1') // Remove any remaining code blocks
        .replace(/\\n/g, '\n') // Replace \n with actual line breaks
        .replace(/\\t/g, '\t') // Replace \t with actual tabs
        .replace(/\\"/g, '"') // Replace \" with actual quotes
        .replace(/\\\\/g, '\\') // Replace \\ with actual backslashes
        .trim(); // Remove extra whitespace

      if (code && code.length > 0) {
        // Update the current question with the generated code
        if (currentQuestion && setCurrentQuestion) {
          setCurrentQuestion({ 
            ...currentQuestion, 
            code: code,
            codeLang: language // Also update the language
          });
          toast.success('Code generated successfully!');
        }
      } else {
        console.error("Extraction failed. Response:", res);
        toast.error("Failed to extract code from response");
      }
    } catch (error) {
      console.error('Error generating code:', error);
      toast.error("Failed generating AI Content");
    } finally {
      setIsGeneratingAI(false);
    }
  };
  

// Set the code language when the current question changes
useEffect(() => {
  if (currentQuestion?.codeLang) {
    setLanguage(currentQuestion.codeLang);
  }
}, [currentQuestion]);

// Handle language selection change
const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const newLanguage = e.target.value;
  setLanguage(newLanguage);
  
  if (currentQuestion && setCurrentQuestion) {
    setCurrentQuestion({
      ...currentQuestion,
      codeLang: newLanguage
    });
  }
  
    setError("");
    setOutput("");
  };

  const handleRunCode = async () => {
    if (!currentQuestion?.code) {
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
          files: [{ name: `Main.${language}`, content: currentQuestion.code }],
        },
        {
          headers: {
            "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
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
   <div className="bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden border-0 shadow-2xl relative">
  {/* Gradient top border */}
  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500" />
  
  <div className="p-2 pt-4 sm:p-6">
    {/* Header Section */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg">
          <Code2 className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl font-black bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 bg-clip-text text-transparent">
          Code Editor
        </h2>
      </div>
      
      {/* Actions Section */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {/* Language Selector */}
        <select
          onChange={handleLanguageChange}
          value={language}
          className="h-10 px-3 rounded-lg border-2 border-indigo-100 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all"
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="c_cpp">C++</option>
          <option value="rust">Rust</option>
          <option value="swift">Swift</option>
        </select>

        {/* AI Generate Button - Desktop */}
        <Button 
          size="sm" 
          variant="outline"
          className="hidden sm:flex h-10 px-4 text-sm font-semibold border-2 border-indigo-200 hover:border-indigo-400 rounded-lg overflow-hidden group transition-all hover:scale-105"
          onClick={generateCode}
          disabled={isGeneratingAI}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 flex items-center gap-2">
            {isGeneratingAI ? (
              <>
                <svg className="animate-spin h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-indigo-600">Generating...</span>
              </>
            ) : (
              <>
                <div className="p-1 rounded-md bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                  <Wand2 className="h-3.5 w-3.5 text-indigo-600" />
                </div>
                <span className="text-indigo-600">Generate with AI</span>
              </>
            )}
          </div>
        </Button>

        {/* AI Generate Button - Mobile */}
        <Button 
          size="sm" 
          variant="outline"
          className="flex sm:hidden h-10 w-10 p-0 border-2 border-indigo-200 hover:border-indigo-400 rounded-lg overflow-hidden group transition-all hover:scale-105 items-center justify-center"
          onClick={generateCode}
          disabled={isGeneratingAI}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            {isGeneratingAI ? (
              <svg className="animate-spin h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Wand2 className="h-4 w-4 text-indigo-600" />
            )}
          </div>
        </Button>

        {/* Run Code Button */}
        <button
          onClick={handleRunCode}
          disabled={isLoading}
          className="relative h-10 px-4 sm:px-5 rounded-lg text-white text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 overflow-hidden group hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500" />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Shine effect */}
          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700" />
          
          <div className="relative z-10 flex items-center gap-2">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <div className="p-1 rounded-md bg-white/20">
                <Play className="h-3.5 w-3.5" />
              </div>
            )}
            <span className="sm:hidden">Run</span>
            <span className="hidden sm:inline whitespace-nowrap">Run Code</span>
          </div>
        </button>
      </div>
    </div>

    {/* Editor and Output Section */}
    <div className="space-y-6">
      {/* Code Editor */}
      <div className="rounded-lg overflow-hidden border-2 border-indigo-100 shadow-lg">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <span className="text-xs font-semibold text-gray-600 ml-2">{language}</span>
          </div>
          <Badge className="px-2 py-1 bg-indigo-100 text-indigo-700 border-0 text-xs font-bold">
            Editor
          </Badge> 
        </div>
        <AceEditor
          mode={language}
          theme="github"
          value={editorValue}
          onChange={(newCode) => {
            if (currentQuestion && setCurrentQuestion) {
              setCurrentQuestion({
                ...currentQuestion,
                code: newCode
              });
            }
          }}
          name="aceCodeEditor"
          editorProps={{ $blockScrolling: true }}
          enableBasicAutocompletion={true}
          enableLiveAutocompletion={true}
          enableSnippets={true}
          fontSize={14}
          style={{ borderRadius: "0" }}
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

      {/* Output Section */}
      {(output || error) && (
        <div className="rounded-lg overflow-hidden border-2 border-indigo-100 shadow-lg">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-4 sm:px-6 py-3 border-b border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white shadow-sm">
                <Terminal className="h-4 w-4 text-indigo-600" />
              </div>
              <span className="text-sm sm:text-base font-bold text-gray-900">Output</span>
            </div>
            {error ? (
              <Badge className="px-3 py-1 bg-red-100 text-red-700 border-0 text-xs font-bold">
                Error
              </Badge>
            ) : (
              <Badge className="px-3 py-1 bg-green-100 text-green-700 border-0 text-xs font-bold">
                Success
              </Badge>
            )}
          </div>
          <div className="p-4 sm:p-6 bg-white max-h-[400px] overflow-y-auto custom-scrollbar">
            {error ? (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-100 flex-shrink-0">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-700 mb-1">Error</p>
                  <pre className="text-sm whitespace-pre-wrap text-gray-700 font-mono bg-red-50 p-3 rounded-lg border border-red-200">{error}</pre>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-100 flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-700 mb-1">Success</p>
                  <pre className="text-sm whitespace-pre-wrap text-gray-700 font-mono bg-green-50 p-3 rounded-lg border border-green-200">{output}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </div>

  <style jsx>{`
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(to bottom, #818cf8, #60a5fa);
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(to bottom, #6366f1, #3b82f6);
    }
  `}</style>
</div>
  );
};

