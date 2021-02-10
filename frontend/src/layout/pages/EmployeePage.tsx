import CRUDPage, { CellDictionary } from "../../components/common/CRUDPage";
import EmployeeForm from "../../components/employee/EmployeeForm";
import { employeeSubject } from "../../rxjs/record.subject";
import { DraftEmployee } from "../../model";
import { Day, Employee, EmployeeSkill } from "../../types";

function EmployeePage() {
  const cellDictionary = new CellDictionary<Employee>([
    { key: "name" },
    { key: "contract" },
    {
      key: "workingDays",
      formatValue: (days: Day[]) => days.map((d) => d.name.name).join(","),
    },
    {
      key: "skills",
      formatValue: (skills: EmployeeSkill[]) => {
        return skills
          .map((skill) => `${skill.shift.title}: (${skill.level})`)
          .join(",");
      },
    },
  ]);
  return (
    <CRUDPage<Employee, DraftEmployee>
      cellDictionary={cellDictionary}
      subject={employeeSubject}
      formComponent={EmployeeForm}
    />
  );
}
export default EmployeePage;
