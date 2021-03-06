import CRUDPage, { CellDictionary } from "../../components/common/CRUDPage";
import ShiftForm from "../../components/common/shift/ShiftForm";
import { DraftShift } from "../../model";
import { shiftSubject } from "../../rxjs/record.subject";
import { Shift } from "../../types";

function ShiftPage() {
  const cellDictionary = new CellDictionary<Shift>([
    { key: "title" },
    { key: "duration" },
  ]);
  return (
    <CRUDPage<Shift, DraftShift>
      cellDictionary={cellDictionary}
      subject={shiftSubject}
      formComponent={ShiftForm}
    />
  );
}
export default ShiftPage;
