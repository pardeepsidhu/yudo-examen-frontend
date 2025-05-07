import React, { useState, useEffect, KeyboardEvent } from "react";
import axios from "axios";
import { useTheme } from "../../context/theme.context";

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

  // Fetch suggestions from Datamuse API based on searchTerm
  useEffect(() => {
    const fetchTags = async () => {
      if (searchTerm.trim().length === 0) return;
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
      }
    };
    fetchTags();
  }, [searchTerm, category]);

  // Add a tag to selected list
  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag];
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
      handleAddTag(searchTerm.trim());
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
        Tags (type to search and select)
      </label>
      <input
        id="tags"
        name="tags"
        type="text"
        placeholder="Start typing to search tags or press Enter to add"
        className="w-full border border-gray-300 rounded p-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      {suggestedTags.length > 0 && (
        <ul className="border rounded bg-white shadow max-h-40 overflow-y-auto">
          {suggestedTags.map((tag) => (
            <li
              key={tag}
              className="p-2 hover:bg-gray-200 cursor-pointer"
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
            className="px-2  rounded-sm flex items-center space-x-1"
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
              className="text-red-600 hover:text-red-800 ml-1"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagSelector; 