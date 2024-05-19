import React from "react";

export default function SectionButton({
    name,
    onClick
}) {
  return (
    <button className="p-[2px] relative" onClick={onClick}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg" />
      <div className="px-8 py-2 bg-white rounded-[6px]  relative group transition duration-200 text-blue-500 font-semibold text-xl hover:bg-transparent hover:text-white">
        {name}
      </div>
    </button>
  );
}
