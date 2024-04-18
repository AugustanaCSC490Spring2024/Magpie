
import React, { useState } from 'react';
import './Dropdown.css';

const Dropdown = ({ options }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (event) => {
    const selectedValue = event.target.value;
    const selectedOption = options.find(option => option.value === selectedValue);
    setSelectedOption(selectedOption);
  };

  return (
    <div className="dropdown">
      <select onChange={handleOptionSelect}>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {selectedOption && (
        <div className="description">
          <p>{selectedOption.description}</p>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
