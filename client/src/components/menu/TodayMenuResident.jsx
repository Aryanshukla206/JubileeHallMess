import React from 'react';
import { useMenu } from '../../context/MenuContext';
import getTodayDate from '../../utils/getTodayDate';

const TodayMenuResident = () => {
    const { getMenuForDate, offDays } = useMenu();
    const mealTypes = ['breakfast', 'lunch', 'dinner'];
    const date = getTodayDate();

    // Check if today is an off day
    if (offDays.some((offDay) => offDay.date === date)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-4xl font-serif font-bold">Mess Is Off for Today</h1>
            </div>
        );
    }

    // Fetch the menu object for today; expected shape:
    // { breakfast: [{ name: ..., type: 'veg'|'nonveg'|'water'|... }, ...], lunch: [...], dinner: [...] }
    const menuForDate = getMenuForDate(date);

    // If no menu data, show “off” message
    if (
        !menuForDate ||
        (!menuForDate.breakfast.length &&
            !menuForDate.lunch.length &&
            !menuForDate.dinner.length)
    ) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-4xl font-serif font-bold">Mess Is Off for Today</h1>
            </div>
        );
    }

    // // Helper to pick Tailwind classes based on item type
    // const getItemClasses = (type) => {
    //     switch (type) {
    //         case 'nonveg':
    //             return 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100';
    //         case 'veg':
    //             return 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100';
    //         case 'water':
    //             return 'bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-100';
    //         default:
    //             return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    //     }
    // };

    return (
        <div className="max-w-4xl mx-auto mt-8 mb-12 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-[#1A627D]"> Today&rsquo;s Meal</h1>
                <p className="mt-1 text-black">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Menu Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-lg">
                    <thead>
                        <tr className="bg-[#1A627D]">
                            {mealTypes.map((meal) => (
                                <th
                                    key={meal}
                                    className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider"
                                >
                                    {meal.charAt(0).toUpperCase() + meal.slice(1)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr >
                            {mealTypes.map((meal) => {
                                const items = menuForDate[meal] || [];

                                return (
                                    <td key={meal} className="  px-6 py-5 align-top">
                                        <div className="space-y-2">
                                            {items.length > 0 ? (
                                                items.map((item) => (
                                                    <div className='text-blue-900'> {item}</div>
                                                ))
                                            ) : (
                                                <div className="italic text-gray-400 dark:text-gray-500">
                                                    No items listed
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TodayMenuResident;
