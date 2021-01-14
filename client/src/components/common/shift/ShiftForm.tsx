import { ErrorDictionary } from "../../../hooks/useValidation";
import { DraftShift, shifttoDraft } from "../../../model";
import { shiftSubject } from "../../../rxjs/record.subject";
import { Shift } from "../../../types";
import CRUDForm, { FormField, FormFieldType } from "../CRUDForm";

type ShiftFormProps = {
  record: Shift | null;
};

function ShiftForm({ record }: ShiftFormProps) {
  const initialState: DraftShift = {
    title: "",
    duration: 0,
  };
  const draftShift = record ? shifttoDraft(record) : null;

  function validateForm(): ErrorDictionary {
    const errors: ErrorDictionary = {};
    // if (.some((e) => e.name === employee.name)) {
    //   errors["employee"] = "An employee with same name already exists";
    // }

    return errors;
  }

  const fields: FormField<DraftShift>[] = [
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
    <CRUDForm<DraftShift>
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
