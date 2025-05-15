'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
import {Menu, Settings, User, ChevronDown} from 'lucide-react';
import {RTK} from '../../store/index';
import {useDispatch} from "react-redux";
import {useDynamicSelector} from "@/hooks/useDynamicSelector";
import { useRouter } from 'next/navigation';

export default function ResponsiveNavbar() {
const router = useRouter();
    const dispatch = useDispatch();
    const centerRef = useRef(null);
    const kebabMenuRef = useRef(null); // Ref for the kebab menu
    const [visibleItems, setVisibleItems] = useState([]);
    const [overflowItems, setOverflowItems] = useState([]);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [isKebabOpen, setIsKebabOpen] = useState(false);
    const hoverTimeout = useRef(null);
    const [kebabSubmenuOpen, setKebabSubmenuOpen] = useState(null);
    const navItems1 = useDynamicSelector('navbar') || {};
    const navData = navItems1?.data?.fetch || [];

    const navItems = useMemo(() => {
        const dynamicItems = navData.map(item => ({
            title: item.title,
            sub_items: item.sub_items || []
        }));

        // Static nav item
        const staticItems = [
            {
                title: "Module List",
                sub_items: [],
                isStatic: true,
                url: "/modules"
            }
        ];

        return [...staticItems, ...dynamicItems];
    }, [navData]);

    console.log(navData)

    useEffect(() => {
        if (navItems.length > 0) {
            calculateVisibleItems(navItems); // Pass items explicitly
        }
    }, [navItems]);


    // Close kebab menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (kebabMenuRef.current && !kebabMenuRef.current.contains(event.target)) {
                setIsKebabOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const calculateVisibleItems = (items) => {
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

        for (let item of items) {
            temp.innerText = item.sub_items;
            const itemWidth = temp.offsetWidth + 32;
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

    const handleMouseEnter = (label) => {
        clearTimeout(hoverTimeout.current);
        setHoveredItem(label);
    };

    const handleMouseLeave = () => {
        hoverTimeout.current = setTimeout(() => setHoveredItem(null), 200);
    };

    const handleKebabSubmenuToggle = (label) => {
        setKebabSubmenuOpen((prev) => (prev === label ? null : label));
    };

    useEffect(() => {
        dispatch(RTK.thunks.navbar.fetch());
    }, []);

    return (
        <nav className="flex items-center justify-between bg-gray-900 text-white px-4 py-2 shadow">
            {/* LEFT - LOGO */}
            <div className="flex-shrink-0 text-xl font-bold text-blue-400">CRM</div>

            {/* CENTER - NAV ITEMS */}
            <div ref={centerRef} className="flex-1 mx-6 flex items-center justify-center">
                <div className="flex gap-2 items-center">
                    {visibleItems.map((item, idx) =>
                        item.sub_items.length === 0 ? (
                            <span
                                key={idx}
                                className="px-3 py-1 rounded hover:bg-gray-700 cursor-pointer whitespace-nowrap text-sm"
                                onClick={() => {
                                    if (item.isStatic && item.url) router.push(item.url);
                                }}
                            >
                                  {item.title}
                                </span>
                        ) : (
                            <div
                                key={idx}
                                className="relative"
                                onMouseEnter={() => handleMouseEnter(item.title)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button
                                    className="px-3 py-1 rounded hover:bg-gray-700 cursor-pointer whitespace-nowrap text-sm flex items-center gap-1"
                                    onClick={() =>
                                        setHoveredItem((prev) => (prev === item.title ? null : item.title))
                                    }
                                >
                                    {item.title}
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform duration-200 ${
                                            hoveredItem === item.title ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>

                                {hoveredItem === item.title && item.sub_items.length > 0 && (
                                    <div
                                        className="absolute left-0 top-full bg-gray-800 text-white rounded shadow-lg mt-1 min-w-[150px] z-50">
                                        {item.sub_items.map((subItem, subIdx) => (
                                            <div
                                                key={subIdx}
                                                className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-sm"
                                            >
                                                {subItem.title}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    )}


                    {/* KEBAB MENU */}
                    <div className="relative z-50" ref={kebabMenuRef}>
                        <button
                            className="p-2 hover:bg-gray-700 rounded"
                            onClick={() => setIsKebabOpen((prev) => !prev)}
                        >
                            <Menu className="w-5 h-5"/>
                        </button>

                        {isKebabOpen && (
                            <div
                                className="absolute top-10 right-0 bg-white text-black rounded shadow-lg min-w-[200px] z-50 flex flex-col p-2 max-h-80 overflow-y-auto"
                            >
                                {/* Search */}
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full px-3 py-1 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    onChange={(e) => {
                                        const q = e.target.value.toLowerCase();
                                        const filtered = navItems.filter(
                                            (item) =>
                                                !visibleItems.includes(item) &&
                                                item.title.toLowerCase().includes(q)
                                        );

                                        setOverflowItems(filtered);
                                    }}
                                />

                                {/* Overflow Items */}
                                {(overflowItems.length > 0 ? overflowItems : navItems.filter((item) => !visibleItems.includes(item))).map(
                                    (item, idx) => (
                                        <div key={idx} className="relative group">
                                            <div
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm whitespace-nowrap rounded flex justify-between items-center"
                                                onClick={() => {
                                                    if (item.sub_items.length > 0) {
                                                        handleKebabSubmenuToggle(item.title);
                                                    }
                                                }}
                                            >
                                                {item.title}
                                                {item.sub_items.length > 0 && (
                                                    <ChevronDown
                                                        className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                                                            kebabSubmenuOpen === item.title ? 'rotate-180' : ''
                                                        }`}
                                                    />
                                                )}
                                            </div>

                                            {item.sub_items.length > 0 && kebabSubmenuOpen === item.title && (
                                                <div
                                                    className="absolute top-full left-0 mt-1 bg-white text-black rounded shadow-lg z-60 min-w-[150px]">
                                                    {item.sub_items.map((subItem, subIdx) => (
                                                        <div
                                                            key={subIdx}
                                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                        >
                                                            {subItem.title}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )
                                )}


                                {/* + New Module */}
                                <div className="mt-2 border-t border-gray-200 pt-2">
                                    <div
                                        className="px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 cursor-pointer rounded"
                                        onClick={() => alert('+ New Module Clicked')}
                                    >
                                        + New Module
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT - PROFILE */}
            <div className="flex-shrink-0 flex gap-4 items-center">
                <User className="w-5 h-5 cursor-pointer hover:text-blue-400"/>
                <Settings className="w-5 h-5 cursor-pointer hover:text-blue-400"/>
            </div>
        </nav>
    );
}