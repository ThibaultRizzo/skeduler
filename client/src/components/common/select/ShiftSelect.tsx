import { Shift } from "../../../types";
import { shiftSubject } from "../../../rxjs/record.subject";
import FormSelect from "../FormSelect";

type ShiftSelectProps = {
  id: string;
  multiple?: boolean;
  onChange: (value: Shift[]) => void;
};

export default function ShiftSelect({
  id,
  multiple = false,
  onChange,
}: ShiftSelectProps) {
  return (
    <FormSelect
      id={id}
      multiple={multiple}
      name="shift-select"
      label="Shift select"
      onChange={onChange}
      getData={shiftSubject.lazyFetchAll}
      getKey={(d) => d.id}
      getLabel={(d) => d.title}
    />
  );
}
