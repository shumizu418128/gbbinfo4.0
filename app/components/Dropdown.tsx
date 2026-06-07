import { useEffect, useRef, useState, type ReactNode } from "react";

type DropdownItem = {
  key: string;
  href: string;
  label: string;
  isActive?: boolean;
};

type DropdownProps = {
  trigger: ReactNode;
  items: DropdownItem[];
};

export const Dropdown = ({ trigger, items }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-6">
      <button
        type="button"
        className="cursor-pointer text-white"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {trigger}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 z-20 mt-2 min-w-24 overflow-hidden bg-zinc-800/80 shadow-lg backdrop-blur-md">
          {items.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className={`block cursor-pointer p-2 text-center hover:bg-(--hover-background-color) ${
                item.isActive ? "font-bold text-(--gbb-color)" : "font-bold text-white"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
