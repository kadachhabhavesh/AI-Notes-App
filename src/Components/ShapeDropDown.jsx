import React, { useState } from "react";

const ShapeDropDown = ({ selectShape, setSelectShape }) => {
  const [isOpen, setIsOpen] = useState(false); // Dropdown visibility state
  const [selectedOption, setSelectedOption] = useState(<div className="w-6 h-2 border-black border-1 flex items-center justify-center"><div className="w-5 border-t-2 border-black"></div></div>); 

  const options = [
    { id: 1, label: "square", content: <div className="w-6 h-5 border-black border-2"></div> },
    { id: 2, label: "circle", content: <div className="w-6 h-6 border-black border-2 rounded-full"></div> },
    { id: 3, label: "line", content: <div className="w-6 h-2 border-black border-1 flex items-center justify-center"><div className="w-5 border-t-2 border-black"></div></div> },
  ];

  const handleOptionClick = (option) => {
    setSelectedOption(option.content);
    setSelectShape(option.label);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Dropdown Button */}
      <button
        className="w-full rounded-md px-4 py-2 bg-transparent text-left shadow-sm focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {options.map((option) => (
            <div
              key={option.id}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleOptionClick(option)}
            >
              {option.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShapeDropDown;
