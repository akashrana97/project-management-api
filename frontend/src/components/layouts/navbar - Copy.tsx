'use client';

import {useEffect, useRef, useState} from 'react';
import {Menu, Settings, User} from 'lucide-react';

const navItems = [
    'Home', 'Leads', 'Contacts', 'Accounts', 'Deals',
    'Tasks', 'Meetings', 'Calls', 'Reports', 'Analytics',
    'Products', 'Quotes', 'Sales Orders', 'Purchase Orders',
    'Invoices', 'Campaigns', 'Vendors', 'Cases', 'Solutions', 'Forecasts',
];

export default function ResponsiveNavbar() {
    const centerRef = useRef(null);
    const [visibleItems, setVisibleItems] = useState(navItems);
    const [overflowItems, setOverflowItems] = useState([]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => calculateVisibleItems());
        if (centerRef.current) resizeObserver.observe(centerRef.current);

        calculateVisibleItems(); // Initial calc

        return () => resizeObserver.disconnect();
    }, []);

    const calculateVisibleItems = () => {
        const center = centerRef.current;
        if (!center) return;

        const availableWidth = center.offsetWidth;
        let totalWidth = 0;
        const visible = [];
        const overflow = [];

        const temp = document.createElement('span');
        temp.style.visibility = 'hidden';
        temp.style.position = 'absolute';
        temp.style.whiteSpace = 'nowrap';
        temp.className = 'px-3 py-1 font-medium text-sm';
        document.body.appendChild(temp);

        for (let item of navItems) {
            temp.innerText = item;
            const itemWidth = temp.offsetWidth + 32; // buffer/padding

            if (totalWidth + itemWidth < availableWidth - 50) {
                visible.push(item);
                totalWidth += itemWidth;
            } else {
                overflow.push(item);
            }
        }

        document.body.removeChild(temp);
        setVisibleItems(visible);
        setOverflowItems(overflow);
    };

    return (
        <nav className="flex items-center justify-between bg-gray-900 text-white px-4 py-2 shadow">

            {/* LEFT - LOGO */}
            <div className="flex-shrink-0 text-xl font-bold text-blue-400">
                CRM
            </div>

            {/* CENTER - NAV ITEMS + KEBAB */}
            <div ref={centerRef} className="flex-1 mx-6 flex items-center justify-center">
                <div className="flex gap-2 items-center">
                    {visibleItems.map((item, idx) => (
                        <span key={idx}
                              className="px-3 py-1 rounded hover:bg-gray-700 cursor-pointer whitespace-nowrap text-sm">
              {item}
            </span>
                    ))}

                    {/*{overflowItems.length > 0 && (*/}
                        {/* Always Show Kebab Menu */}
<div className="relative group z-50">
                            <button className="p-2 hover:bg-gray-700 rounded">
                                <Menu className="w-5 h-5"/>
                            </button>
                            <div
                                className="absolute top-8 right-0 bg-white text-black rounded shadow-lg min-w-[200px] z-50 hidden group-hover:flex flex-col p-2 max-h-80 overflow-y-auto">

                                {/* Search Input */}
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full px-3 py-1 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    onChange={(e) => {
                                        const q = e.target.value.toLowerCase();
                                        const filtered = navItems.filter(item =>
                                            !visibleItems.includes(item) && item.toLowerCase().includes(q)
                                        );
                                        setOverflowItems(filtered);
                                    }}
                                />

    {/* Overflow Items */}
    {(overflowItems.length > 0 ? overflowItems : navItems.filter(item => !visibleItems.includes(item))).map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm whitespace-nowrap rounded"
                                    >
                                        {item}
                                    </div>
                                ))}

                                {/* + New Module (bottom) */}
                                <div className="mt-2 border-t border-gray-200 pt-2">
                                    <div
        className="px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 cursor-pointer rounded"
        onClick={() => {
          // TODO: open modal or trigger logic
          alert('+ New Module Clicked');
        }}
      >
                                        + New Module
                                    </div>
                                </div>
                            </div>

                        </div>
                    {/*)}*/}

                </div>
            </div>

            {/* RIGHT - PROFILE + SETTINGS */}
            <div className="flex-shrink-0 flex gap-4 items-center">
                <User className="w-5 h-5 cursor-pointer hover:text-blue-400"/>
                <Settings className="w-5 h-5 cursor-pointer hover:text-blue-400"/>
            </div>
        </nav>
    );
}
