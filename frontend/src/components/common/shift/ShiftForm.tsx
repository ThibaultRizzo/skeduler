import { ErrorDictionary } from "../../../hooks/useValidation";
import { Draft, shifttoDraft } from "../../../model";
import { shiftSubject } from "../../../rxjs/record.subject";
import { Shift, ShiftImportance } from "../../../types";
import { shiftImportanceFactory } from "../../../utils/enum";
import CRUDForm, { FormField, FormFieldType } from "../CRUDForm";
import EnumSelect from "../select/EnumSelect";

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
    {
      type: FormFieldType.NUMBER,
      id: "cover-monday-input",
      name: "coverMonday",
    },
    {
      type: FormFieldType.NUMBER,
      id: "cover-tuesday-input",
      name: "coverTuesday",
    },
    {
      type: FormFieldType.NUMBER,
      id: "cover-wednesday-input",
      name: "coverWednesday",
    },
    {
      type: FormFieldType.NUMBER,
      id: "cover-thursday-input",
      name: "coverThursday",
    },
    {
      type: FormFieldType.NUMBER,
      id: "cover-friday-input",
      name: "coverFriday",
    },
    {
      type: FormFieldType.NUMBER,
      id: "cover-saturday-input",
      name: "coverSaturday",
    },
    {
      type: FormFieldType.NUMBER,
      id: "cover-sunday-input",
      name: "coverSunday",
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
    >
      {(shift, setShift) => (
        <EnumSelect<ShiftImportance>
          id="shift-importance-select"
          label="Shift importance"
          onChange={([shiftImportance]) => {
            setShift({ ...shift, shiftImportance });
          }}
          value={shift.shiftImportance}
          factory={shiftImportanceFactory}
        />
      )}
    </CRUDForm>
  );
}

export default ShiftForm;
