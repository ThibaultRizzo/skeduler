import { ErrorDictionary } from "../../../hooks/useValidation";
import { Draft, shifttoDraft } from "../../../model";
import { shiftSubject } from "../../../rxjs/record.subject";
import { Shift, ShiftImportance } from "../../../types.d";
import CRUDForm, { FormField, FormFieldType } from "../CRUDForm";

type ShiftFormProps = {
  record: Shift | null;
};

const DEFAULT_SHIFT_COVER = 1;

function ShiftForm({ record }: ShiftFormProps) {
  const initialState: Draft<Shift> = {
    title: "",
    duration: 0,
    shiftImportance: ShiftImportance.Minor,
    coverMonday: DEFAULT_SHIFT_COVER,
    coverTuesday: DEFAULT_SHIFT_COVER,
    coverWednesday: DEFAULT_SHIFT_COVER,
    coverThursday: DEFAULT_SHIFT_COVER,
    coverFriday: DEFAULT_SHIFT_COVER,
    coverSaturday: DEFAULT_SHIFT_COVER,
    coverSunday: DEFAULT_SHIFT_COVER,
  };
  const draftShift = record ? shifttoDraft(record) : null;

  function validateForm(): ErrorDictionary {
    const errors: ErrorDictionary = {};
    // if (.some((e) => e.name === employee.name)) {
    //   errors["employee"] = "An employee with same name already exists";
    // }

    return errors;
  }

  const fields: FormField<Draft<Shift>>[] = [
    {
      type: FormFieldType.STRING,
      id: "title-input",
      name: "title",
    },
    {
      type: FormFieldType.NUMBER,
      id: "duration-input",
      name: "duration",
    },
  ];

  return (
    <CRUDForm<Draft<Shift>>
      createOne={shiftSubject.createOne}
      updateOne={(d) => shiftSubject.updateOne({ id: record!.id, ...d })}
      isCreation={!record}
      name="shift"
      initialState={draftShift || initialState}
      validateForm={validateForm}
      fields={fields}
    />
  );
}

export default ShiftForm;
