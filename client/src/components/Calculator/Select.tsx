interface SelectProps {
  label: string;
  options: readonly { value: string; label: string }[];
  error?: { message?: string };
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: () => void;
  name: string;
  id?: string;
}

export function Select({
  label,
  options,
  error,
  value,
  onChange,
  onBlur,
  name,
  id,
}: SelectProps) {
  const selectId = id ?? name;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={selectId} className="text-sm font-bold text-dark">
        {label}
      </label>
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`rounded-xl border p-2 ${
          error ? 'border-red-500' : 'border-gray-300'
        } bg-secondary`}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : undefined}
      >
        {options.map(({ value: optValue, label: optLabel }) => (
          <option key={optValue} value={optValue}>
            {optLabel}
          </option>
        ))}
      </select>
      {error && (
        <span id={`${selectId}-error`} className="text-sm text-red-500">
          {error.message}
        </span>
      )}
    </div>
  );
}
