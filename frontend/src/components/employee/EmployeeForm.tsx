import { ErrorDictionary } from "../../hooks/useValidation";
import { DraftEmployee, employeetoDraft } from "../../model";
import { Employee } from "../../types";
import CRUDForm, { FormField, FormFieldType } from "../common/CRUDForm";
import DaySelect from "../common/select/DaySelect";
import EmployeeSkillSelect from "../common/select/EmployeeSkillSelect";
import { employeeSubject } from "../../rxjs/record.subject";

type EmployeeFormProps = {
  record: Employee | null;
};

function EmployeeForm({ record }: EmployeeFormProps) {
  const initialState = {
    name: "",
    contract: 0,
    skills: [],
    workingDays: [],
  };
  const draftEmployee = record ? employeetoDraft(record) : null;

  function validateForm(): ErrorDictionary {
    const errors: ErrorDictionary = {};
    // if (.some((e) => e.name === employee.name)) {
    //   errors["employee"] = "An employee with same name already exists";
    // }

    return errors;
  }

  const fields: FormField<DraftEmployee>[] = [
    {
      type: FormFieldType.STRING,
      id: "name-input",
      name: "name",
    },
    {
      type: FormFieldType.NUMBER,
      id: "contract-input",
      name: "contract",
    },
  ];

  return (
    <CRUDForm<DraftEmployee>
      createOne={employeeSubject.createOne}
      updateOne={(d) => employeeSubject.updateOne({ id: record!.id, ...d })}
      isCreation={!record}
      name="employee"
      initialState={draftEmployee || initialState}
      validateForm={validateForm}
      fields={fields}
    >
      {(employee, setEmployee) => (
        <>
          <DaySelect
            id="day-select"
            multiple
            value={employee.workingDays}
            onChange={(workingDays) =>
              setEmployee({
                ...employee,
                workingDays: workingDays.map((d) => d.name.name),
              })
            }
          />

          <EmployeeSkillSelect
            id="employee-skill-select"
            multiple
            value={employee.skills}
            onChange={(skills) => setEmployee({ ...employee, skills })}
          />
        </>
      )}
    </CRUDForm>
  );
}

export default EmployeeForm;
