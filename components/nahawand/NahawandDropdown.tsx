
import React from 'react';
import { DropdownOption, NahawandHarakahOptionValue, NahawandHummingOptionValue } from './nahawandTypes';
import { SELECT_ARROW_SVG_URL } from './nahawandConstants';

interface NahawandDropdownProps<T extends string> {
  id: string;
  label: string;
  options: DropdownOption<T>[];
  selectedValue: T;
  onChange: (value: T) => void;
}

const NahawandDropdown = <T extends NahawandHarakahOptionValue | NahawandHummingOptionValue>({ 
  id, 
  label, 
  options, 
  selectedValue, 
  onChange 
}: NahawandDropdownProps<T>) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={selectedValue}
          onChange={(e) => onChange(e.target.value as T)}
          className="w-full appearance-none border border-gray-300 bg-white text-slate-800 rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          style={{
            backgroundImage: `url("${SELECT_ARROW_SVG_URL}")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '1.5em 1.5em',
          }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default NahawandDropdown;
