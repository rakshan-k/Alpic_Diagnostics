import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchFields: string[];
  selectedField: string;
  onFieldChange: (field: string) => void;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  searchFields,
  selectedField,
  onFieldChange
}: SearchBarProps) {
  return (
    <div className="flex gap-4">
      <select
        value={selectedField}
        onChange={(e) => onFieldChange(e.target.value)}
        className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white px-4 py-2 appearance-none bg-right"
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          paddingRight: '2.5rem'
        }}
      >
        {searchFields.map((field) => (
          <option key={field} value={field} className="py-2">
            Search by {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </option>
        ))}
      </select>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
      </div>
    </div>
  );
}