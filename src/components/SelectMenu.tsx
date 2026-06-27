import { useEffect, useRef } from "react";

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

export const SelectMenu = ({ label, items }: SelectMenuProps) => {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      const details = detailsRef.current;
      if (
        details instanceof HTMLDetailsElement &&
        details.open &&
        !details.contains(target)
      ) {
        details.open = false;
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <details ref={detailsRef} className="select-menu relative">
      <summary className="flex min-h-10 w-full min-w-40 cursor-pointer list-none items-center justify-between gap-2 border border-(--button-border-color) px-4 py-2 text-white [&::-webkit-details-marker]:hidden">
        <span className="truncate text-2xl md:text-3xl lg:text-4xl">{label}</span>
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
          className="select-menu__chevron shrink-0 transition-transform"
          aria-hidden="true"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </summary>

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
            className="flex cursor-pointer items-center gap-2 p-2 text-white hover:bg-(--hover-background-color)"
          >
            <span className="h-2 w-2 shrink-0 bg-(--gbb-color)" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {item.isActive && (
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
            )}
          </a>
        ))}
      </div>
    </details>
  );
};
