import React, { useEffect, useState } from "react";
import { useAsyncState } from "../../hooks/useAsyncState";

type FormSelectProps<T> = Partial<
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange">
> & {
  id: string;
  label: string;
  name: string;
  multiple: boolean;
  onChange: (value: T[]) => void;
  getData: () => Promise<T[]>;
  getKey: (data: T) => string;
  getLabel: (data: T) => string;
  getValue?: (data: T) => unknown;
};

export default function FormSelect<T extends unknown>({
  id,
  label,
  name,
  multiple = false,
  onChange,
  getKey,
  getLabel,
  getValue = (d) => d,
  getData,
  ...selectProps
}: FormSelectProps<T>) {
  const [selected, setSelected] = useState<string[] | undefined>(undefined);
  const [data] = useAsyncState<T[] | null>(null, getData);

  const getSelectedOptions = (
    options: HTMLCollectionOf<HTMLOptionElement>
  ): T[] => {
    let result = new Array<T | undefined>(options.length);
    for (let i = 0; i < options.length; i++) {
      result[i] =
        data?.find((d) => getKey(d) === options[i].value) || undefined;
    }
    return result.filter((r) => r !== undefined) as T[];
  };

  useEffect(() => {
    if (selected && data && data.length > 0) {
      setSelected([getKey(data[0])]);
    }
  }, [selected, data, onChange, getKey, setSelected]);

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        name={name}
        disabled={data === null}
        multiple={multiple}
        onChange={({ target }) => {
          onChange(getSelectedOptions(target.selectedOptions));
        }}
        value={selected}
        {...selectProps}
      >
        {/* <option value={undefined}>Lol</option> */}
        {data !== null &&
          data.map((d) => (
            <option key={getKey(d)} id={getKey(d)} value={getKey(d)}>
              {getLabel(d)}
            </option>
          ))}
      </select>
    </div>
  );
}
