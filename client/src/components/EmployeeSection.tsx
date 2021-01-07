import React, { FormEvent, useEffect, useState } from "react";
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
} from "../api/employee.api.";
import { DraftEmployee } from "../model";
import { Employee } from "../types";
import FormInput from "./common/FormInput";
import DaySelect from "./common/select/DaySelect";
import EmployeeSkillSelect from "./common/select/EmployeeSkillSelect";
import useValidation, { ErrorDictionary } from "./hooks/useValidation";

export default function EmployeeSection() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employee, setEmployee] = useState<DraftEmployee>({
    name: "",
    contract: 0,
    skills: [],
    workingDays: [],
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  function validateForm(): ErrorDictionary {
    const errors: ErrorDictionary = {};
    if (employees.some((e) => e.name === employee.name)) {
      errors["employee"] = "An employee with same name already exists";
    }

    return errors;
  }
  const [validation, validate] = useValidation(validateForm);

  async function fetchEmployees() {
    const data = await getEmployees();
    setEmployees(data);
  }

  async function onSubmitEmployee(e: FormEvent) {
    e.preventDefault();
    validate();
    if (validation.isValid) {
      const newEmployee = await createEmployee(employee);
      if (newEmployee) {
        setEmployees([...employees, newEmployee]);
      }
    } else {
      alert("Something went wrong");
    }
  }

  async function onDeleteEmployee(id: string) {
    const isDeleted = await deleteEmployee(id);
    if (!isDeleted) {
      alert("Could not delete");
    } else {
      setEmployees(employees.filter((e) => e.id !== id));
    }
  }

  return (
    <section>
      <h1>Employees</h1>

      <form onSubmit={onSubmitEmployee}>
        <div>
          {Object.entries(validation.errors).map(([field, error], i) => (
            <h4 key={field + i}>
              {field}:{error}
            </h4>
          ))}
        </div>
        <FormInput
          id="name-input"
          label="Name:"
          onChange={(name) => setEmployee({ ...employee, name })}
        />
        <FormInput
          id="contract-input"
          label="Contract:"
          type="number"
          onChange={(contract) =>
            setEmployee({ ...employee, contract: +contract })
          }
        />
        <DaySelect
          id="working-day-select"
          multiple
          onChange={(workingDays) =>
            setEmployee({
              ...employee,
              workingDays: workingDays.map((d) => d.name),
            })
          }
        />

        <EmployeeSkillSelect
          id="employee-skill-select"
          multiple
          onChange={(skills) => setEmployee({ ...employee, skills })}
        />

        <button type="submit">Submit</button>
      </form>

      <ul>
        {employees.map((employee) => (
          <li id={employee.id} key={employee.id}>
            <button onClick={() => onDeleteEmployee(employee.id)}>
              Delete
            </button>
            {employee.id}
            <br />
            {employee.name} - {employee.contract}
            <br />
            {employee.workingDays
              ? employee.workingDays.map((d) => d.name).join(", ")
              : "No day"}
          </li>
        ))}
      </ul>
    </section>
  );
}
