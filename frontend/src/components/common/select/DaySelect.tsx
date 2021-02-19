import { daySubject } from "../../../rxjs/record.subject";
import { Day, DayEnum } from "../../../types";
import { MultiFormSelect } from "../FormSelect";

export type DaySelectProps = {
  id: string;
  multiple: boolean;
  value?: DayEnum[];
  onChange: (value: Day[]) => void;
};

function DaySelect({ id, multiple, value, onChange }: DaySelectProps) {
  const getActiveDays = async () => {
    const days = await daySubject.lazyFetchAll();
    return await days.filter((d) => d.active);
  };

  return (
    <MultiFormSelect
      id={id}
      name="day-select"
      label="Day select"
      value={value}
      onChange={onChange}
      getData={getActiveDays}
      getKey={(d) => d.name}
      getLabel={(d) => d.name}
    />
  );
}

export default DaySelect;
