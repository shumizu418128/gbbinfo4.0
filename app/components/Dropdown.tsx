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
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className="cursor-pointer text-white"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {trigger}
      </button>

      {isOpen && (
        <div className="absolute z-20 min-w-24 bg-black">
          {items.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className={`block text-center bg-(--button-background-color) ${
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
