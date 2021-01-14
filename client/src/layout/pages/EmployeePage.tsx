import CRUDPage, { CellDictionary } from "../../components/common/CRUDPage";
import EmployeeForm from "../../components/employee/EmployeeForm";
import { employeeSubject } from "../../rxjs/record.subject";
import { DraftEmployee } from "../../model";
import { Employee } from "../../types";

function EmployeePage() {
  const cellDictionary = new CellDictionary<Employee>([{ key: "name" }]);
  return (
    <CRUDPage<Employee, DraftEmployee>
      cellDictionary={cellDictionary}
      subject={employeeSubject}
      formComponent={EmployeeForm}
    />
  );
}
export default EmployeePage;
