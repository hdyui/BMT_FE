import type { RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // The generic parameters must mirror TanStack's declaration for module merging.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string;
  }
}
