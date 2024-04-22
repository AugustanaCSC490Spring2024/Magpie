import React, { useState } from 'react';
import '../styles/Dropdown.css'; // Correct import statement for CSS file

const Dropdown = ({ options = [] }) => { // Ensure options has a default value of an empty array
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
