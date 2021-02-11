import { useState } from "react";
import { useSubject } from "../../hooks/useAsyncState";
import {
  BaseCRUDRecord,
  CRUDSubject,
  ReadSubject,
} from "../../rxjs/crud.subject";
import { CellDictionary } from "./CRUDPage";

type CRUDTableProps<T extends BaseCRUDRecord, D> = {
  subject: ReadSubject<T> | CRUDSubject<T, D>;
  cellDictionary: CellDictionary<T>;
  onSelect: ((record: T) => void) | null;
  onDelete: ((recordId: string) => void) | null;
};

function CRUDTable<T extends BaseCRUDRecord, D>({
  cellDictionary,
  subject,
  onSelect,
  onDelete,
}: CRUDTableProps<T, D>) {
  const [lines] = useSubject(null, subject);
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
          {/* Space for checkbox */}
          {onDelete && <th />}
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
                onClick={onSelect ? () => onSelect(line) : undefined}
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

export default CRUDTable;
