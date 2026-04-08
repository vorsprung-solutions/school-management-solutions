import React from "react";
import { createPortal } from "react-dom";

export default function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-10">
      <div className="bg-[#1D293D] text-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        {children}

        <div className="flex justify-end bg-[#1D293D] px-6 py-3">
          <button
            onClick={() => onClose(false)}
            className="bg-blue-700 cursor-pointer text-white hover:text-blue-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
