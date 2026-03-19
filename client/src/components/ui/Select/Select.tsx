import { useState, useRef, useEffect, type ReactNode } from 'react';

export interface SelectOption<T = string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface SelectProps<T = string> {
  label: string;
  options: readonly SelectOption<T>[];
  error?: { message?: string } | undefined;
  value: T;
  onChange: (value: T) => void;
  onBlur: () => void;
  name: string;
  id?: string;
  placeholder?: string;
}

export function Select<T extends string>({
  label,
  options,
  error,
  value,
  onChange,
  onBlur,
  name,
  id,
  placeholder = 'בחר...',
}: SelectProps<T>) {
  const selectId = id ?? name;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onBlur();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onBlur]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }
    const idx = options.findIndex((o) => o.value === value);
    if (e.key === 'ArrowDown' && idx < options.length - 1) {
      e.preventDefault();
      onChange(options[idx + 1].value);
    } else if (e.key === 'ArrowUp' && idx > 0) {
      e.preventDefault();
      onChange(options[idx - 1].value);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const baseInputClasses =
    'peer w-full rounded-xl border p-2 bg-white text-sm font-medium text-primary active:scale-100 [-webkit-tap-highlight-color:transparent] focus:outline-none focus:ring-2 focus:ring-offset-0';
  const borderClasses = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-200 focus:border-primary focus:ring-primary';
  const hasValue = !!selectedOption;
  const labelFloated = hasValue || isOpen;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        id={selectId}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : undefined}
        aria-label={label}
        className={`flex min-h-[42px] w-full items-center justify-between gap-2 hover:scale-100 ${baseInputClasses} ${borderClasses}`}
        onClick={() => setIsOpen((o) => !o)}
        onKeyDown={handleKeyDown}
      >
        <span className="flex items-center gap-2">
          {selectedOption ? (
            <>
              {selectedOption.icon && (
                <span className="flex shrink-0" aria-hidden>
                  {selectedOption.icon}
                </span>
              )}
              <span>{selectedOption.label}</span>
            </>
          ) : (
            <span className="invisible">{placeholder}</span>
          )}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 text-primary transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <label
        htmlFor={selectId}
        className={`absolute start-2 z-10 top-2 rounded-md px-2 font-bold shadow-md transition-all duration-150 ease-in-out text-dark bg-secondary ${labelFloated ? '-translate-y-3/4' : ''
          }`}
      >
        {label}
      </label>
      {isOpen && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border bg-white py-1 shadow-lg"
          dir="rtl"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm font-normal text-primary ${opt.value === value ? 'bg-primary/10 font-medium' : ''}`}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.icon && (
                <span className="flex shrink-0" aria-hidden>
                  {opt.icon}
                </span>
              )}
              <span>{opt.label}</span>
            </li>
          ))}
        </ul>
      )}
      {error && (
        <span id={`${selectId}-error`} className="mt-1 block text-sm text-red-500">
          {error.message}
        </span>
      )}
    </div>
  );
}
