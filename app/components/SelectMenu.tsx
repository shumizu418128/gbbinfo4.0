import { useEffect, useRef, useState } from "react";

type SelectMenuItem = {
  key: string;
  href: string;
  label: string;
  isActive?: boolean;
};

type SelectMenuProps = {
  label: string;
  items: SelectMenuItem[];
};

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`shrink-0 transition-transform ${isOpen ? "" : "rotate-180"}`}
    aria-hidden="true"
  >
    <path d="m18 15-6-6-6 6" />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0 text-(--gbb-color)"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const SelectMenu = ({ label, items }: SelectMenuProps) => {
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
        className="flex min-h-10 w-full min-w-40 cursor-pointer items-center justify-between gap-2 border border-(--button-border-color) px-4 py-2 text-white"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="truncate text-2xl md:text-3xl lg:text-4xl">{label}</span>

        <ChevronIcon isOpen={isOpen} />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 z-20 mt-2 min-w-full overflow-hidden bg-zinc-800/80 shadow-lg backdrop-blur-md"
          role="listbox"
        >
          {items.map((item) => (
            <a
              key={item.key}
              href={item.href}
              role="option"
              aria-selected={item.isActive}
              className="flex cursor-pointer items-center gap-2 p-2 text-white hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-(--gbb-color)" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.isActive && <CheckIcon />}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
