"use client";

import { useState } from "react";

const Sidebar = ({menuItems}) => {
    const [activeComponent, setActiveComponent] = useState(menuItems[0].component);

  return (
    <div className="flex">
    <aside className="relative left-0 top-24 h-[50vh] w-52 bg-white  rounded-tr-xl rounded-br-xl shadow-lg">
      {/* Sidebar Header */}
      <div className="p-4 text-lg font-bold text-purple-600 border-b border-purple-600">Applications</div>

      {/* Sidebar Menu */}
      <nav className="flex flex-col p-4">
        {menuItems.map((item, index) => (
          <div
          key={index}
          onClick={() => setActiveComponent(item.component)}
          className="flex items-center gap-5 my-3 p-3 rounded-md hover:bg-indigo-200 transition cursor-pointer"
        >
          {item.icon}
          <span>{item.name}</span>
        </div>
        ))}
      </nav>
    </aside>
    <main className="p-6 pt-14 min-h-screen pl-14">{activeComponent}</main>
    </div>
  );
};

export default Sidebar;
