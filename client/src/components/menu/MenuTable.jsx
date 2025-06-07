import React, { useState } from 'react';
import { useMenu } from '../../context/MenuContext';
import { Edit2, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import CollapsibleSection from '../common/CollapsibleSection';
const MenuTable = () => {
  const { menu, updateMenu, updateDayMeal, getMenuForDate } = useMenu();
  const { isAdmin } = useAuth();
  const { success } = useToast();

  // //console.log("-----------> ", menu);

  const [editMode, setEditMode] = useState({
    isEditing: false,
    day: null,
    meal: null
  });

  const [editedItems, setEditedItems] = useState([]);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  // //console.log("days ----------> ", days);
  const mealTypes = ['breakfast', 'lunch', 'dinner'];

  // Format day name for display
  const formatDay = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  // Format meal name for display
  const formatMeal = (meal) => {
    return meal.charAt(0).toUpperCase() + meal.slice(1);
  };

  const handleEdit = (day, mealType) => {
    setEditMode({
      isEditing: true,
      day,
      meal: mealType
    });

    // Initialize edited items with current menu items
    setEditedItems(menu[day][mealType]);
  };

  const handleItemChange = (e, index) => {
    const value = e.target.value;
    const newItems = [...editedItems];
    newItems[index] = value;
    setEditedItems(newItems);
  };

  const handleAddItem = () => {
    setEditedItems([...editedItems, '']);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...editedItems];
    newItems.splice(index, 1);
    setEditedItems(newItems);
  };

  const handleSave = () => {
    // Filter out empty items
    const filteredItems = editedItems.filter(item => item.trim() !== '');
    // //console.log("Filtered items: ", filteredItems);

    // Update menu
    // updateMenu(editMode.day, editMode.meal, filteredItems);
    updateDayMeal(editMode.day, editMode.meal, filteredItems);

    // Reset edit mode
    setEditMode({
      isEditing: false,
      day: null,
      meal: null
    });

    // Show success message
    success("Menu updated successfully");
  };

  const handleCancel = () => {
    // Reset edit mode without saving
    setEditMode({
      isEditing: false,
      day: null,
      meal: null
    });
  };
  // //console.log("Menu items: ", menu["sunday"]["breakfast"]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <CollapsibleSection title={"Weekly Mess Menu"}>
        {/* <div className="bg-blue-600 text-white p-4">
          <h2 className="text-xl font-bold">Weekly Mess Menu</h2>

        </div> */}

        <div className="p-4 overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border-b border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Day
                </th>
                {mealTypes.map(meal => (
                  <th
                    key={meal}
                    className="border-b border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {formatMeal(meal)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map(day => (
                <tr key={day} className="hover:bg-gray-50">
                  <td className="border-b border-gray-200 px-4 py-4 text-sm font-medium text-gray-800">
                    {formatDay(day)}
                  </td>
                  {mealTypes.map(mealType => (
                    <td key={`${day}-${mealType}`} className="border-b border-gray-200 px-4 py-4 text-sm text-gray-600">
                      {editMode.isEditing && editMode.day === day && editMode.meal === mealType ? (
                        <div className="space-y-2">
                          {editedItems.map((item, index) => (
                            <div key={index} className="flex items-center">
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleItemChange(e, index)}
                                className="flex-1 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              />
                              <button
                                onClick={() => handleRemoveItem(index)}
                                className="ml-1 p-1 text-red-500 hover:bg-red-50 rounded"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                          <div className="flex space-x-2 mt-2">
                            <button
                              onClick={handleAddItem}
                              className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded hover:bg-blue-100"
                            >
                              + Add Item
                            </button>
                            <button
                              onClick={handleSave}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              title="Save"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Cancel"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ) : (

                        <div>
                          <ul className="list-disc list-inside">
                            {menu[day][mealType].map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>

                          {isAdmin && (
                            <button
                              onClick={() => handleEdit(day, mealType)}
                              className="mt-2 p-1 text-blue-600 hover:bg-blue-50 rounded inline-flex items-center text-xs"
                              disabled={editMode.isEditing}
                            >
                              <Edit2 size={14} className="mr-1" />
                              Edit
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollapsibleSection>
    </div >
  );
};

export default MenuTable;