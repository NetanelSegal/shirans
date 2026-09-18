import { Input } from '@/components/ui/Input';

interface TableSearchBoxProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function TableSearchBox({ label, value, onChange }: TableSearchBoxProps) {
  return (
    <div className="mb-4 max-w-sm">
      <Input
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      />
    </div>
  );
}
