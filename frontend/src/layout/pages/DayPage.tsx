import CRUDPage, { CellDictionary } from "../../components/common/CRUDPage";
import DayForm from "../../components/common/day/DayForm";
import { Draft } from "../../model";
import { daySubject } from "../../rxjs/record.subject";
import { Day, DayEnum, Shift } from "../../types";

function DayPage() {
  const cellDictionary = new CellDictionary<Day>([
    {
      key: "name",
      formatValue: (days: DayEnum[]) => days.map((d) => d.name).join(","),
    },
    { key: "active" },
  ]);
  return (
    <CRUDPage<Day, Draft<Shift>>
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
