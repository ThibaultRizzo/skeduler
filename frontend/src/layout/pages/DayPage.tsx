import CRUDPage, { CellDictionary } from "../../components/common/CRUDPage";
import DayForm from "../../components/common/day/DayForm";
import { Draft } from "../../model";
import { daySubject } from "../../rxjs/record.subject";
import { Day, DayEnum } from "../../types";

function DayPage() {
  const cellDictionary = new CellDictionary<Day>([
    {
      key: "name",
      formatValue: (day: DayEnum) => day.name,
    },
    { key: "active" },
  ]);
  return (
    <CRUDPage<Day, Draft<Day>>
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
