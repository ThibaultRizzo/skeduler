import { Shift } from "../../../types";
import { shiftSubject } from "../../../rxjs/record.subject";
import { SingleFormSelect, MultiFormSelect } from "../FormSelect";

type ShiftSelectProps = {
  id: string;
  multiple?: boolean;
  onChange: ((value: Shift[]) => void) | ((value: Shift) => void);
};

export default function ShiftSelect({
  id,
  multiple = false,
  onChange,
}: ShiftSelectProps) {
  if (multiple) {

    return (
      <MultiFormSelect<Shift>
        id={id}
        name="shift-select"
        label="Shift select"
        onChange={onChange as (value: Shift[]) => void}
        getData={shiftSubject.lazyFetchAll}
        getKey={(d) => d.id}
        getLabel={(d) => d.title}
      />
    );
  } else {
    return (
      <SingleFormSelect<Shift>
        id={id}
        name="shift-select"
        label="Shift select"
        onChange={onChange as (value: Shift) => void}
        getData={shiftSubject.lazyFetchAll}
        getKey={(d) => d.id}
        getLabel={(d) => d.title} />
    )
  }
}
