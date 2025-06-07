import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CollapsibleSection = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleOpen = () => setIsOpen(prev => !prev);

    return (
        <>
            <div
                className="bg-blue-600 text-white p-4 flex justify-between items-center cursor-pointer"
                onClick={toggleOpen}
            >
                <h2 className="text-lg font-medium  text-gray-100 ">{title}</h2>
                {isOpen ? (
                    <ChevronUp className="bg-blue-200 h-5 w-5 border-2 rounded-md text-gray-800" />
                ) : (
                    <ChevronDown className="bg-blue-200 h-5 w-5 border-2 rounded-md text-gray-800" />
                )}
            </div>

            {isOpen && (
                <div className="mt-4">
                    {children}
                </div>
            )}
        </>
    );
};

export default CollapsibleSection;
