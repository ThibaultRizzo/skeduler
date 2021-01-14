import React, { useEffect, useState } from "react";
import { useAsyncState } from "../../hooks/useAsyncState";
import { areArraysEqual } from "../../utils/utils";

type FormSelectProps<T> = Partial<
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange">
> & {
  id: string;
  label: string;
  name: string;
  value?: string[];
  multiple: boolean;
  onChange: (value: T[]) => void;
  getData: () => Promise<T[]>;
  getKey: (data: T) => string;
  getLabel: (data: T) => string;
};

export default function FormSelect<T>({
  id,
  label,
  name,
  value,
  multiple = false,
  onChange,
  getKey,
  getLabel,
  getData,
  ...selectProps
}: FormSelectProps<T>) {
  const [selected, setSelected] = useState<string[] | undefined>(value);
  const [data] = useAsyncState<T[] | null>(null, getData);

  const getSelectedOptions = (
    options: HTMLCollectionOf<HTMLOptionElement>
  ): string[] => {
    let result = new Array<string>(options.length);
    for (let i = 0; i < options.length; i++) {
      result[i] = options[i].value;
    }
    return result;
  };

  useEffect(() => {
    // If data is loaded and selected is not defined
    const getReturnValues = (): T[] =>
      (selected || [])
        .map((o) => data?.find((d) => getKey(d) === o))
        .filter((d) => d) as T[];

    if (!selected && data && data.length > 0) {
      setSelected([getKey(data[0])]);
    } else if (selected && data && !areArraysEqual(value || [], selected)) {
      onChange(getReturnValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, data, setSelected]);

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        name={name}
        disabled={data === null}
        multiple={multiple}
        onChange={({ target }) =>
          setSelected(getSelectedOptions(target.selectedOptions))
        }
        value={selected}
        {...selectProps}
      >
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
