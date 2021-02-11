import CRUDPage, { CellDictionary } from "../../components/common/CRUDPage";
import ShiftForm from "../../components/shift/ShiftForm";
import { Draft } from "../../model";
import { shiftSubject } from "../../rxjs/record.subject";
import { Shift } from "../../types";

function ShiftPage() {
  const cellDictionary = new CellDictionary<Shift>([
    { key: "title" },
    { key: "duration" },
    { key: "shiftImportance" },
    {
      key: "cover",
      formatValue: (v: Shift) =>
        `${v.coverMonday} ${v.coverTuesday} ${v.coverWednesday} ${v.coverThursday} ${v.coverFriday} ${v.coverSaturday} ${v.coverSunday}`,
      isCombined: true,
    },
  ]);
  return (
    <CRUDPage<Shift, Draft<Shift>>
      cellDictionary={cellDictionary}
      subject={shiftSubject}
      formComponent={ShiftForm}
    />
  );
}
export default ShiftPage;
