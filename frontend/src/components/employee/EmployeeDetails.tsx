import { Employee } from "../../types";
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
            label="Contract"
            value={employee.workingDays?.map((w) => w.name.name).join(",")}
          />
          <LabelValue
            label="Skills"
            value={employee.skills
              .map((s) => `${s.shift.title} - ${s.level}`)
              .join(",")}
          />
        </section>

        <EmployeeAgenda employee={employee.id} />
        <EmployeeEventList />
      </article>
    );
  }
};

export default EmployeeDetails;
