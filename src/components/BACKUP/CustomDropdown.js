import React, { useState } from 'react';
import './CustomDropdown.css'; // Import the CSS file

const CustomDropdown = ({ options, onSelect, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  const handleDelete = (event, index) => {
    event.stopPropagation(); // Prevent the dropdown from closing
    onDelete(index);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div className="custom-dropdown" onMouseLeave={handleMouseLeave}><div className="custom-dropdown-toggle" onClick={handleToggle}>
        {options.length > 0 ? 'Select a query' : 'No queries available'}
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▾</span></div>
      {isOpen && (
        <div className="custom-dropdown-menu">
          {options.map((option, index) => (
            <div key={index} className="custom-dropdown-item"><span onClick={() => handleSelect(option)}>{option}</span><button className="delete-button" onClick={(event) => handleDelete(event, index)}>Delete</button></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
