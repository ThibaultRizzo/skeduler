import { daySubject } from "../../../rxjs/record.subject";
import { Day, DayName } from "../../../types";
import FormSelect from "../FormSelect";

export type DaySelectProps = {
  id: string;
  multiple: boolean;
  value?: DayName[];
  onChange: (value: Day[]) => void;
};

function DaySelect({ id, multiple, value, onChange }: DaySelectProps) {
  const getActiveDays = async () => {
    const days = await daySubject.lazyFetchAll();
    return await days.filter((d) => d.active);
  };

  return (
    <FormSelect
      id={id}
      multiple={multiple}
      name="day-select"
      label="Day select"
      value={value}
      onChange={onChange}
      getData={getActiveDays}
      getKey={(d) => d.name.name}
      getLabel={(d) => d.name.name}
    />
  );
}

export default DaySelect;
