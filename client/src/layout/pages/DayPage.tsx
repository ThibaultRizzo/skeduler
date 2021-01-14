import CRUDPage, { CellDictionary } from "../../components/common/CRUDPage";
import DayForm from "../../components/common/day/DayForm";
import { DraftShift } from "../../model";
import { daySubject } from "../../rxjs/record.subject";
import { Day } from "../../types";

function DayPage() {
  const cellDictionary = new CellDictionary<Day>([
    { key: "order" },
    { key: "name" },
    { key: "active" },
  ]);
  return (
    <CRUDPage<Day, DraftShift>
      cellDictionary={cellDictionary}
      subject={daySubject}
      formComponent={DayForm}
      config={{
        canCreate: false,
        canDelete: false,
        canUpdate: true,
      }}
    />
  );
}
export default DayPage;
