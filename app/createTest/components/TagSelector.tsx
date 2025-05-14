import React, { useState, useEffect, KeyboardEvent } from "react";
import axios from "axios";
import { useTheme } from "../../context/theme.context";
import { X } from "lucide-react";

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

  // Update selected tags when testSeriesData changes
  useEffect(() => {
    setSelectedTags(testSeriesData.tags || []);
  }, [testSeriesData.tags]);

  // Fetch suggestions from Datamuse API based on searchTerm
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
            ml: searchTerm, // meaning like
            topics: category || "", // optional topic filter
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

  // Add a tag to selected list
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

  // Remove a tag
  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = selectedTags.filter((tag) => tag !== tagToRemove);
    setSelectedTags(newTags);
    setTestSeriesData({ ...testSeriesData, tags: newTags });
  };

  // Handle Enter key press
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      e.preventDefault();
      handleAddTag(searchTerm);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          id="tags"
          name="tags"
          type="text"
          placeholder="Start typing to search tags or press Enter to add"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {isLoading && (
          <div className="absolute right-2 top-2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {suggestedTags.length > 0 && (
        <ul className="border rounded-md bg-white shadow-lg max-h-40 overflow-y-auto z-10">
          {suggestedTags.map((tag) => (
            <li
              key={tag}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleAddTag(tag)}
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-2 mt-2">
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-md flex items-center space-x-1 text-sm"
            style={{ 
              backgroundColor: `${theme.primary}20`,
              color: theme.primary,
              border: `1px solid ${theme.primary}`
            }}
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="hover:bg-red-100 rounded-full p-0.5"
              aria-label={`Remove ${tag} tag`}
            >
              <X className="h-3 w-3 text-red-600" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagSelector; 