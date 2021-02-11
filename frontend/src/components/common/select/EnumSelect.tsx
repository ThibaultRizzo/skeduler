import { EnumFactory } from "../../../utils/enum";
import { MultiFormSelect, SingleFormSelect } from "../FormSelect";

type EnumSelectProps<T extends Object> = {
  id: string;
  label: string;
  value: string;
  factory: EnumFactory<T>;
};

type SingleEnumSelectProps<T extends Object> = EnumSelectProps<T> & {
  onChange: (value: T) => void;
}

type MultiEnumSelectProps<T extends Object> = EnumSelectProps<T> & {
  onChange: (value: T[]) => void;
}

export function SingleEnumSelect<T extends Object>({
  id,
  label,
  factory,
  value,
  onChange,
}: SingleEnumSelectProps<T>) {
  return (
    <SingleFormSelect<T>
      id={id}
      name="enum-select"
      label={label}
      onChange={onChange}
      getData={async () => factory.list}
      getKey={(v) => v.toString()}
      getLabel={(v) => v.toString()}
    />
  );
}

export function MultiEnumSelect<T extends Object>({
  id,
  label,
  factory,
  value,
  onChange,
}: MultiEnumSelectProps<T>) {
  return (
    <MultiFormSelect<T>
      id={id}
      name="enum-select"
      label={label}
      onChange={onChange}
      getData={async () => factory.list}
      getKey={(v) => v.toString()}
      getLabel={(v) => v.toString()}
    />
  );
}
