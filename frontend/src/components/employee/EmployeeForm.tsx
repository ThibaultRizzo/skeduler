import { ErrorDictionary } from "../../hooks/useValidation";
import { DraftEmployee, employeetoDraft } from "../../model";
import { CreateEmployeeInput, Employee, EmployeeAvailability } from "../../types";
import CRUDForm, { FormField, FormFieldType } from "../common/CRUDForm";
import DaySelect from "../common/select/DaySelect";
import EmployeeSkillSelect from "../common/select/EmployeeSkillSelect";
import { employeeSubject } from "../../rxjs/record.subject";
import { SingleEnumSelect } from "../common/select/EnumSelect";
import { employeeAvailabilityFactory } from "../../utils/enum";

type EmployeeFormProps = {
  record: Employee | null;
};

function EmployeeForm({ record }: EmployeeFormProps) {
  const initialState: CreateEmployeeInput = {
    name: "",
    contract: 0,
    skills: [],
    availabilityMonday: EmployeeAvailability.NotWorking,
    availabilityTuesday: EmployeeAvailability.NotWorking,
    availabilityWednesday: EmployeeAvailability.NotWorking,
    availabilityThursday: EmployeeAvailability.NotWorking,
    availabilityFriday: EmployeeAvailability.NotWorking,
    availabilitySaturday: EmployeeAvailability.NotWorking,
    availabilitySunday: EmployeeAvailability.NotWorking
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
          <SingleEnumSelect<EmployeeAvailability>
            id="monday-availability-select"
            label="Monday"
            onChange={(availabilityMonday) => {
              setEmployee({ ...employee, availabilityMonday });
            }}
            value={employee.availabilityMonday}
            factory={employeeAvailabilityFactory}
          />
          <SingleEnumSelect<EmployeeAvailability>
            id="tuesday-availability-select"
            label="Tuesday"
            onChange={(availabilityTuesday) => {
              setEmployee({ ...employee, availabilityTuesday });
            }}
            value={employee.availabilityTuesday}
            factory={employeeAvailabilityFactory}
          />
          <SingleEnumSelect<EmployeeAvailability>
            id="wednesday-availability-select"
            label="Wednesday"
            onChange={(availabilityWednesday) => {
              setEmployee({ ...employee, availabilityWednesday });
            }}
            value={employee.availabilityWednesday}
            factory={employeeAvailabilityFactory}
          />
          <SingleEnumSelect<EmployeeAvailability>
            id="thursday-availability-select"
            label="Thursday"
            onChange={(availabilityThursday) => {
              setEmployee({ ...employee, availabilityThursday });
            }}
            value={employee.availabilityThursday}
            factory={employeeAvailabilityFactory}
          />
          <SingleEnumSelect<EmployeeAvailability>
            id="friday-availability-select"
            label="Friday"
            onChange={(availabilityFriday) => {
              setEmployee({ ...employee, availabilityFriday });
            }}
            value={employee.availabilityFriday}
            factory={employeeAvailabilityFactory}
          />
          <SingleEnumSelect<EmployeeAvailability>
            id="saturday-availability-select"
            label="Saturday"
            onChange={(availabilitySaturday) => {
              setEmployee({ ...employee, availabilitySaturday });
            }}
            value={employee.availabilitySaturday}
            factory={employeeAvailabilityFactory}
          />
          <SingleEnumSelect<EmployeeAvailability>
            id="sunday-availability-select"
            label="Sunday"
            onChange={(availabilitySunday) => {
              setEmployee({ ...employee, availabilitySunday });
            }}
            value={employee.availabilitySunday}
            factory={employeeAvailabilityFactory}
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
