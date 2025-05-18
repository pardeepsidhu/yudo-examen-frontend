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
  Wand2
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
    <div className="bg-white rounded-2xl sm:rounded-xl overflow-hidden border border-gray-100">
      <div className="p-1 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <Code2 className="h-6 w-6 sm:h-8 sm:w-8" style={{ color: theme.primary }} />
            <h2 className="text-md sm:text-xl font-bold text-gray-900">Code Editor</h2>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <select
              onChange={handleLanguageChange}
              value={language}
              className="px-3 sm:px-3 py-2 rounded-sm sm:rounded-sm border border-gray-200 text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="c_cpp">C++</option>
              <option value="rust">Rust</option>
              <option value="swift">Swift</option>
            </select>

            <Button 
                        size="sm" 
                        variant="outline"
              className="text-xs hidden sm:flex items-center gap-1 py-4.5"
                        onClick={generateCode}
                        disabled={isGeneratingAI}
                      >
                        {isGeneratingAI ? (
                          <span className="flex items-center gap-1">
                            <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                          </span>
                        ) : ( 
                          <>
                            <Wand2 className="h-3 w-3" /> Generate with AI
                          </>
                        )}
                      </Button>

                      <Button 
                        size="sm" 
                        variant="outline"
              className="text-xs flex sm:hidden items-center gap-1 py-4.5"
                        onClick={generateCode}
                        disabled={isGeneratingAI}
                      >
                        {isGeneratingAI ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            
                          </span>
                        ) : ( 
                          <>
                            <Wand2 className="h-3 w-3" /> 
                          </>
                        )}
                      </Button>
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

