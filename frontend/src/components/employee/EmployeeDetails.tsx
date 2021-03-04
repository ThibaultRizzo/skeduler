import { getEmployeeDays } from "../../model";
import { Employee, EmployeeAvailability } from "../../types";
import LabelValue from "../common/LabelValue";
import EmployeeAgenda from "./EmployeeAgenda";
import EmployeeEventList from "./EmployeeEventList";

type EmployeeDetailsProps = {
  employee: Employee | null;
};

const EmployeeDetails = ({ employee }: EmployeeDetailsProps) => {
  if (!employee) {
    return null;
  } else {
    return (
      <article>
        <section>
          <h3>{employee.name}</h3>
          <LabelValue label="ID" value={employee.id} />
          <LabelValue label="Contract" value={employee.contract} />
          <LabelValue
            label="Working Days"
            value={getEmployeeDays(employee, EmployeeAvailability.Working).join(",")}
          />
          <LabelValue
            label="Available Days"
            value={getEmployeeDays(employee, EmployeeAvailability.Available).join(",")}
          />
          <LabelValue
            label="Skills"
            value={employee.skills
              .map((s) => `${s.shiftId} - ${s.level}`)
              .join(",")}
          />
        </section>

        <EmployeeAgenda employeeId={employee.id} />
        <EmployeeEventList employeeId={employee.id} />
      </article>
    );
  }
};

export default EmployeeDetails;
