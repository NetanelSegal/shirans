import Loader from '@/components/Loader/Loader';
import { useScreenContext } from '@/contexts/ScreenProvider';
import { DesktopTable } from './DesktopTable';
import { MobileCardList } from './MobileCardList';
import { TableSearchBox } from './TableSearchBox';
import { TableStatusMessage } from './TableStatusMessage';
import { useDataTableInstance } from './useDataTableInstance';
import type { DataTableProps } from './types';

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'אין נתונים להצגה',
  getRowId,
  actions,
  actionsHeader = 'פעולות',
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  searchPlaceholder,
}: DataTableProps<T>) {
  const { isSmallScreen } = useScreenContext();
  const { rows, sortStateByKey, globalFilter, setGlobalFilter } = useDataTableInstance(
    columns,
    data,
  );

  const toggleRow = (id: string) => {
    if (!onSelectionChange) return;
    onSelectionChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id],
    );
  };

  const toggleAll = () => {
    if (!onSelectionChange) return;
    const allIds = rows.map((row) => getRowId(row));
    const allSelected = allIds.every((id) => selectedIds.includes(id));
    onSelectionChange(allSelected ? [] : allIds);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-gray-200 bg-white p-8">
        <Loader />
      </div>
    );
  }

  if (data.length === 0) {
    return <TableStatusMessage>{emptyMessage}</TableStatusMessage>;
  }

  return (
    <div>
      {searchPlaceholder && (
        <TableSearchBox
          label={searchPlaceholder}
          value={globalFilter}
          onChange={setGlobalFilter}
        />
      )}
      {rows.length === 0 ? (
        <TableStatusMessage>אין תוצאות התואמות לחיפוש</TableStatusMessage>
      ) : isSmallScreen ? (
        <MobileCardList
          columns={columns}
          rows={rows}
          getRowId={getRowId}
          actions={actions}
          selectable={selectable}
          selectedIds={selectedIds}
          onToggleRow={toggleRow}
        />
      ) : (
        <DesktopTable
          columns={columns}
          rows={rows}
          getRowId={getRowId}
          actions={actions}
          actionsHeader={actionsHeader}
          selectable={selectable}
          selectedIds={selectedIds}
          onToggleRow={toggleRow}
          onToggleAll={toggleAll}
          sortStateByKey={sortStateByKey}
        />
      )}
    </div>
  );
}
