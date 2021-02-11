import { FunctionComponent, ReactNode, useState } from "react";
import sidebarStore from "../../store/sidebar.store";
import {
  CRUDSubject,
  BaseCRUDRecord,
  ReadSubject,
} from "../../rxjs/crud.subject";
import { BasicFormProps } from "./CRUDForm";
import CRUDTable from "./CRUDTable";

export type CellDefinition<T> = {
  key: keyof T | string;
  header?: string;
  formatValue?: (v: any) => string | number;
  isCombined?: boolean;
  className?: string;
};
export class CellDictionary<T extends BaseCRUDRecord> {
  cellDefinitions: { [k: string]: CellDefinition<T> };
  headers: string[];

  constructor(cellDef: CellDefinition<T>[]) {
    this.cellDefinitions = cellDef.reduce(
      (acc, val) => ({ ...acc, [val.key]: val }),
      {}
    );
    this.headers = Object.keys(this.cellDefinitions).map(
      (k) => this.cellDefinitions[k as string]?.header || (k as string)
    );
  }

  getValues(v: T): { cellDef: CellDefinition<T>; value: string | number }[] {
    return Object.entries(this.cellDefinitions).map(([k, cellDef]) => ({
      cellDef,
      value: this.getValue(v, k as keyof T, Boolean(cellDef.isCombined)),
    }));
  }

  getValue(v: T, k: keyof T, isCombined: boolean): string | number {
    const value = isCombined ? v : v[k];
    const format = this.cellDefinitions[k as string].formatValue;
    return format ? format(value) : `${value}`;
  }
}

type CRUDPageProps<T extends BaseCRUDRecord, D> = {
  subject: ReadSubject<T> | CRUDSubject<T, D>;
  cellDictionary: CellDictionary<T>;
  formComponent?: FunctionComponent<BasicFormProps<T>>;
  config?: {
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
  };
  children?: (value: T) => ReactNode | null;
};

function CRUDPage<T extends BaseCRUDRecord, D>({
  cellDictionary,
  subject,
  formComponent,
  config = {
    canCreate: true,
    canUpdate: true,
    canDelete: true,
  },
  children,
}: CRUDPageProps<T, D>) {
  const [selectedRecord, setSelectedRecord] = useState<T | null>(null);
  function openCreationForm() {
    sidebarStore.openSidebar(
      "Create record",
      formComponent as FunctionComponent
    );
  }

  function onUpdate(record: T) {
    sidebarStore.openSidebar(
      "Update record",
      formComponent as FunctionComponent,
      {
        record,
      }
    );
  }

  function onDelete(recordId: string) {
    (subject as CRUDSubject<T, D>).deleteOne(recordId);
  }

  const tableProps = {
    cellDictionary,
    subject,
    onSelect: setSelectedRecord,
    onDelete: config.canDelete ? onDelete : null,
  };
  return (
    <article className="crud-page scrollable">
      {config.canCreate && <button onClick={openCreationForm}>Create</button>}
      <CRUDTable<T, D> {...tableProps} />
      {
        selectedRecord && (
          <>
        <button onClick={() => onUpdate(selectedRecord)}>Update</button>
        {children && children(selectedRecord)}
        </>)}
    </article>
  );
}

export default CRUDPage;
