import React, { useState, useEffect, KeyboardEvent } from "react";
import axios from "axios";
import { useTheme } from "../../context/theme.context";
import { X, Tag, Plus, Loader2, Search } from "lucide-react";

interface TestSeriesData {
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  tags: string[];
  credits: string;
  _id: string;
}

interface TagSelectorProps {
  category: string;
  testSeriesData: TestSeriesData;
  setTestSeriesData: React.Dispatch<React.SetStateAction<TestSeriesData>>;
}

const TagSelector = ({ category, testSeriesData, setTestSeriesData }: TagSelectorProps) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(testSeriesData.tags || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setSelectedTags(testSeriesData.tags || []);
  }, [testSeriesData.tags]);

  useEffect(() => {
    const fetchTags = async () => {
      if (searchTerm.trim().length === 0) {
        setSuggestedTags([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await axios.get("https://api.datamuse.com/words", {
          params: {
            ml: searchTerm,
            topics: category || "",
            max: 10,
          },
        });
        setSuggestedTags(response.data.map((item: { word: string }) => item.word));
      } catch (error) {
        console.error("Failed to fetch tags", error);
        setSuggestedTags([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchTags, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, category]);

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (!trimmedTag) return;

    if (!selectedTags.includes(trimmedTag)) {
      const newTags = [...selectedTags, trimmedTag];
      setSelectedTags(newTags);
      setTestSeriesData({ ...testSeriesData, tags: newTags });
    }
    setSearchTerm("");
    setSuggestedTags([]);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = selectedTags.filter((tag) => tag !== tagToRemove);
    setSelectedTags(newTags);
    setTestSeriesData({ ...testSeriesData, tags: newTags });
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      e.preventDefault();
      handleAddTag(searchTerm);
    }
  };

  return (
    <div className="space-y-3">
      {/* Input Field */}
      <div className="relative">
        <div className={`relative flex items-center border-2 rounded-lg transition-all ${
          isFocused 
            ? 'border-indigo-400 ring-4 ring-indigo-100' 
            : 'border-indigo-100 hover:border-indigo-200'
        }`}>
          <div className="absolute left-3 pointer-events-none">
            <Search className="h-4 w-4 text-indigo-400" />
          </div>
          <input
            id="tags"
            name="tags"
            type="text"
            placeholder="Start typing to search tags or press Enter to add"
            className="w-full h-10 pl-10 pr-10 bg-transparent focus:outline-none text-sm text-gray-700 placeholder:text-gray-400 rounded-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          />
          {isLoading && (
            <div className="absolute right-3">
              <Loader2 className="h-4 w-4 text-indigo-600 animate-spin" />
            </div>
          )}
          {!isLoading && searchTerm && (
            <button
              type="button"
              onClick={() => handleAddTag(searchTerm)}
              className="absolute right-2 p-1.5 rounded-md bg-indigo-100 hover:bg-indigo-200 transition-colors group"
            >
              <Plus className="h-4 w-4 text-indigo-600 group-hover:scale-110 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {suggestedTags.length > 0 && (
        <div className="relative z-10">
          <ul className="border-2 border-indigo-100 rounded-lg bg-white shadow-2xl max-h-48 overflow-y-auto custom-scrollbar">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-50 to-blue-50 px-3 py-2 border-b border-indigo-100">
              <p className="text-xs font-bold text-indigo-600 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                Suggested Tags
              </p>
            </div>
            {suggestedTags.map((tag) => (
              <li
                key={tag}
                className="px-3 py-2.5 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 cursor-pointer text-sm font-medium text-gray-700 transition-all flex items-center justify-between group"
                onClick={() => handleAddTag(tag)}
              >
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:scale-125 transition-transform" />
                  {tag}
                </span>
                <Plus className="h-4 w-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Selected Tags */}
      <div className="space-y-2">
        {selectedTags.length > 0 && (
          <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
            <Tag className="h-3.5 w-3.5 text-indigo-500" />
            <span>Selected Tags ({selectedTags.length})</span>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {selectedTags.length === 0 ? (
            <div className="w-full p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-dashed border-indigo-200 text-center">
              <Tag className="h-8 w-8 text-indigo-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-600">No tags selected</p>
              <p className="text-xs text-gray-500 mt-1">Start typing to search and add tags</p>
            </div>
          ) : (
            selectedTags.map((tag, index) => (
              <span
                key={tag}
                className="group relative px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-sm hover:shadow-md transition-all hover:scale-105 border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 hover:from-indigo-100 hover:to-blue-100"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 p-0.5 rounded-full hover:bg-red-100 transition-colors group"
                  aria-label={`Remove ${tag} tag`}
                >
                  <X className="h-3.5 w-3.5 text-red-600 group-hover:rotate-90 transition-transform" />
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #818cf8, #60a5fa);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #6366f1, #3b82f6);
        }
      `}</style>
    </div>
  );
};

export default TagSelector;