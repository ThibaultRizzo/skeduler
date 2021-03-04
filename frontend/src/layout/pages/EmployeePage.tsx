import CRUDPage, { CellDictionary } from "../../components/common/CRUDPage";
import EmployeeForm from "../../components/employee/EmployeeForm";
import { employeeSubject } from "../../rxjs/record.subject";
import { DraftEmployee } from "../../model";
import { Day, Employee, EmployeeSkill } from "../../types";
import EmployeeDetails from "../../components/employee/EmployeeDetails";
import "../../styles/layout/pages/employee.scss";

function EmployeePage() {
  const cellDictionary = new CellDictionary<Employee>([
    { key: "name" },
    { key: "contract" },
    {
      key: "skills",
      formatValue: (skills: EmployeeSkill[]) => {
        return skills
          .map((skill) => `${skill.shiftId}: (${skill.level})`)
          .join(",");
      },
    },
  ]);
  return (
    <CRUDPage<Employee, DraftEmployee>
      cellDictionary={cellDictionary}
      subject={employeeSubject}
      formComponent={EmployeeForm}
    >
      {(employee) => <EmployeeDetails employee={employee} />}
    </CRUDPage>
  );
}
export default EmployeePage;
