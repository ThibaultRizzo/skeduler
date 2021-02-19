import { Shift } from "../../../types";
import { shiftSubject } from "../../../rxjs/record.subject";
import { SingleFormSelect, MultiFormSelect } from "../FormSelect";
import { StandardProps } from "../../../types/types";

type ShiftSelectProps = {
  id: string;
  multiple?: boolean;
  label?: string;
  withRest?: boolean;
  onChange: ((value: Shift[]) => void) | ((value: Shift) => void);
} & StandardProps;

export default function ShiftSelect({
  id,
  label,
  multiple = false,
  withRest = false,
  onChange,
  ...props
}: ShiftSelectProps) {
  const getData = async () => {
    const data = await shiftSubject.lazyFetchAll();
    return withRest ? [{ title: 'Rest', id: '' } as any, ...data] : data;
  }
  if (multiple) {
    return (
      <MultiFormSelect<Shift>
        id={id}
        name="shift-select"
        label={label !== undefined ? label : "Shift select"}
        onChange={onChange as (value: Shift[]) => void}
        getData={getData}
        getKey={(d) => d.id}
        getLabel={(d) => d.title}
        {...props}
      />
    );
  } else {
    return (
      <SingleFormSelect<Shift>
        id={id}
        name="shift-select"
        label={label !== undefined ? label : "Shift select"}
        onChange={onChange as (value: Shift) => void}
        getData={getData}
        getKey={(d) => d.id}
        getLabel={(d) => d.title}
        {...props} />
    )
  }
}
