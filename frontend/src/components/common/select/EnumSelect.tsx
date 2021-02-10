import { EnumFactory } from "../../../utils/enum";
import FormSelect from "../FormSelect";

type EnumSelectProps<T extends Object> = {
  id: string;
  label: string;
  value: string;
  factory: EnumFactory<T>;
  multiple?: boolean;
  onChange: (value: T[]) => void;
};

export default function EnumSelect<T extends Object>({
  id,
  label,
  factory,
  multiple = false,
  value,
  onChange,
}: EnumSelectProps<T>) {
  return (
    <FormSelect
      id={id}
      multiple={multiple}
      name="enum-select"
      label={label}
      // TODO: Fix this horror
      value={(value as any) as string[]}
      onChange={onChange}
      getData={async () => factory.list}
      getKey={(v) => v.toString()}
      getLabel={(v) => v.toString()}
    />
  );
}
