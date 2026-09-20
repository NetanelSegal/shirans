import Button from '@/components/ui/Button';
import { READ_FILTER_TABS, type ReadFilter } from './readFilter';

interface ReadFilterTabsProps {
  value: ReadFilter;
  onChange: (value: ReadFilter) => void;
  /** How many rows each tab would show, appended to its label. */
  counts?: Record<ReadFilter, number>;
}

export function ReadFilterTabs({ value, onChange, counts }: ReadFilterTabsProps) {
  return (
    <div
      className="mb-4 flex flex-wrap gap-2"
      role="group"
      aria-label="סינון לפי סטטוס"
    >
      {READ_FILTER_TABS.map((tab) => (
        <Button
          key={tab.value}
          variant={value === tab.value ? 'primary' : 'light'}
          onClick={() => onChange(tab.value)}
        >
          {counts ? `${tab.label} (${counts[tab.value]})` : tab.label}
        </Button>
      ))}
    </div>
  );
}
