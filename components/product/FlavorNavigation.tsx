import React, { useState } from 'react';
import { Product } from '../../data/products';

interface FlavorNavigationProps {
  products: Product[];
  selectedIndex: number;
  onSelectFlavor: (index: number) => void;
  visible: boolean;
}

export const FlavorNavigation: React.FC<FlavorNavigationProps> = ({
  products,
  selectedIndex,
  onSelectFlavor,
  visible
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!visible) return null;

  return (
    <div className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-35 flex flex-col items-end gap-5 pointer-events-auto select-none">
      {products.map((p, idx) => {
        const isSelected = idx === selectedIndex;
        const isHovered = hoveredIndex === idx;

        return (
          <div key={p.id} className="relative flex items-center justify-end">
            {/* Tooltip on hover */}
            {(isHovered || isSelected) && (
              <span className="absolute right-7 px-2.5 py-1 rounded bg-black/75 backdrop-blur-md border border-white/20 text-[10px] font-tech tracking-widest text-white whitespace-nowrap uppercase shadow-lg transition-all duration-200">
                {p.name}
              </span>
            )}

            {/* Dot Button */}
            <button
              onClick={() => onSelectFlavor(idx)}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative p-1 flex items-center justify-center cursor-pointer group"
              aria-label={`Switch to flavor ${p.name}`}
            >
              {isSelected ? (
                // Selected Dot: Filled with white glow
                <span className="w-3 h-3 rounded-full bg-white shadow-[0_0_12px_#ffffff] transition-all duration-300" />
              ) : (
                // Inactive Dot: Hollow border
                <span className="w-2.5 h-2.5 rounded-full border border-white/40 group-hover:border-white group-hover:scale-125 transition-all duration-200" />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};
