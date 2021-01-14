import { FunctionComponent, useEffect, useState } from "react";
import sidebarStore from "../../store/sidebar.store";
import {
  CRUDSubject,
  BaseCRUDRecord,
  ReadSubject,
} from "../../rxjs/crud.subject";
import { BasicFormProps } from "./CRUDForm";

export type CellDefinition<T> = {
  key: keyof T;
  header?: string;
  formatValue?: (v: unknown) => string | number;
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
      value: this.getValue(v, k as keyof T),
    }));
  }

  getValue(v: T, k: keyof T): string | number {
    const value = v[k];
    const format = this.cellDefinitions[k as string].formatValue;
    return format ? format(value) : ` ${value}`;
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
};

type CRUDTableProps<T extends BaseCRUDRecord, D> = {
  subject: ReadSubject<T> | CRUDSubject<T, D>;
  cellDictionary: CellDictionary<T>;
  onUpdate: ((record: T) => void) | null;
  onDelete: ((recordId: string) => void) | null;
};

function CRUDTable<T extends BaseCRUDRecord, D>({
  cellDictionary,
  subject,
  onUpdate,
  onDelete,
}: CRUDTableProps<T, D>) {
  const [lines, setLines] = useState<T[] | null>(null);
  const [selectedLines, setSelectedLines] = useState<string[]>([]);

  function toggleLine({ id }: T) {
    const isSelected = selectedLines.includes(id);
    if (isSelected) {
      setSelectedLines(selectedLines.filter((lineId) => lineId !== id));
    } else {
      setSelectedLines([...selectedLines, id]);
    }
  }

  function deleteSelectedLine(): void {
    // TODO: Allow bulk delete
    Promise.all(
      selectedLines.map((line) =>
        (subject as CRUDSubject<T, D>).deleteOne(line)
      )
    );
  }

  useEffect(() => {
    // subject.fetchAll();
    subject.subscribe(setLines);
  }, [subject]);
  const headers = cellDictionary.headers;
  return (
    <table>
      <thead>
        {onDelete && (
          <tr>
            <th>
              <button
                disabled={selectedLines.length === 0}
                onClick={deleteSelectedLine}
              >
                Delete
              </button>
            </th>
          </tr>
        )}
        <tr>
          {headers.map((header, i) => (
            <th key={header + i}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {lines ? (
          lines.length > 0 ? (
            lines.map((line, i) => (
              <tr
                key={`line-${line.id}`}
                onClick={onUpdate ? () => onUpdate(line) : undefined}
              >
                {onDelete && (
                  <td
                    key={`checkbox-${line.id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      name="select line"
                      onChange={() => toggleLine(line)}
                    />
                  </td>
                )}
                {cellDictionary.getValues(line).map(({ cellDef, value }) => (
                  <td
                    key={`${cellDef.key}-${line.id}`}
                    className={cellDef.className || ""}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td>No records</td>
            </tr>
          )
        ) : (
          <tr>
            <td>Pulling records...</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
function CRUDPage<T extends BaseCRUDRecord, D>({
  cellDictionary,
  subject,
  formComponent,
  config = {
    canCreate: true,
    canUpdate: true,
    canDelete: true,
  },
}: CRUDPageProps<T, D>) {
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
    onUpdate: config.canUpdate ? onUpdate : null,
    onDelete: config.canDelete ? onDelete : null,
  };
  return (
    <article>
      {config.canCreate && <button onClick={openCreationForm}>Create</button>}
      <CRUDTable<T, D> {...tableProps} />
    </article>
  );
}

export default CRUDPage;
