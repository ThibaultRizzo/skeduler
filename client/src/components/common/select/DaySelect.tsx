import { getDays } from "../../../api/day.api";
import { Day } from "../../../types";
import FormSelect from "../FormSelect";

type DaySelectProps = {
  id: string;
  multiple: boolean;
  onChange: (value: Day[]) => void;
};

export default function DaySelect({ id, multiple, onChange }: DaySelectProps) {
  const getActiveDays = async () => {
    const days = await getDays();
    return await days.filter((d) => d.active);
  };

  return (
    <FormSelect
      id={id}
      multiple={multiple}
      name="day-select"
      label="Day select"
      onChange={onChange}
      getData={getActiveDays}
      getKey={(d) => d.id}
      getLabel={(d) => d.name}
    />
  );
}
