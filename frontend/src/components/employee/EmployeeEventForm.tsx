import { ErrorDictionary } from "../../hooks/useValidation";
import {
  employeeEventToDraft,
} from "../../model";
import {
  CreateEventInput,
  EmployeeEvent,
  EventNature,
  EventStatus,
  EventType,
  Shift,
} from "../../types";
import CRUDForm, { FormField, FormFieldType } from "../common/CRUDForm";
import { employeeEventSubject } from "../../rxjs/record.subject";
import { eventNatureFactory, eventStatusFactory, eventTypeFactory } from "../../utils/enum";
import ShiftSelect from "../common/select/ShiftSelect";
import lightFormat from "date-fns/lightFormat";
import parseISO from 'date-fns/parseISO'

type EmployeeEventFormProps = {
  employee: string;
  record?: EmployeeEvent;
};

function EmployeeEventForm({ record, employee }: EmployeeEventFormProps) {
  const initialState: CreateEventInput = record
    ? employeeEventToDraft(record, employee)
    : {
      duration: 1,
      employee,
      isDesired: true,
      nature: EventNature.Important,
      startDate: new Date(),
      status: EventStatus.Pending,
      type: EventType.Holiday,
    };

  function validateForm(): ErrorDictionary {
    const errors: ErrorDictionary = {};
    // if (.some((e) => e.name === employee.name)) {
    //   errors["employee"] = "An employee with same name already exists";
    // }

    return errors;
  }

  const fields: FormField<CreateEventInput>[] = [
    {
      type: FormFieldType.ENUM_SINGLE,
      id: "nature-input",
      name: "nature",
      factory: eventNatureFactory
    },
    {
      type: FormFieldType.ENUM_SINGLE,
      id: "status-input",
      name: "status",
      factory: eventStatusFactory
    },
    {
      type: FormFieldType.ENUM_SINGLE,
      id: "type-input",
      name: "type",
      factory: eventTypeFactory
    },
    {
      type: FormFieldType.NUMBER,
      id: "duration-input",
      name: "duration",
    },
    {
      type: FormFieldType.DATE,
      id: "start-date-input",
      name: "startDate",
      getter: d => {
        const date = typeof (d.startDate) === 'string' ? parseISO(d.startDate) : d.startDate;
        return lightFormat(date, 'yyyy-MM-dd')
      },
      setter: (d): Date | null => {
        return d && typeof (d) === 'string' ? parseISO(d) : null
      }
    },
    {
      type: FormFieldType.CHECKBOX,
      id: "is-desired-input",
      name: "isDesired",
    },

  ];
  return (
    <section>
      {record && <button onClick={() => employeeEventSubject.deleteOne(record.id)}>Delete</button>}
      <CRUDForm<CreateEventInput>
        createOne={e => employeeEventSubject.createOne({ ...e, employee })}
        updateOne={({ employee, ...d }) => employeeEventSubject.updateOne({ id: record!.id, ...d })}
        isCreation={!record}
        name="employee-event"
        initialState={initialState}
        validateForm={validateForm}
        fields={fields}
      >
        {(employeeEvent, setEmployeeEvent) => (
          <>
            <ShiftSelect
              id="employee-event-shift-select"
              onChange={(shift: Shift) => {
                setEmployeeEvent({ ...employeeEvent, shift: shift?.id });
              }}
            />

          </>
        )}
      </CRUDForm>
    </section>
  );
}

export default EmployeeEventForm;
