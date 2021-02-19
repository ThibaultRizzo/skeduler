import React, { useEffect, useState } from "react";
import { useAsyncState } from "../../hooks/useAsyncState";
import { areArraysEqual } from "../../utils/utils";

type StandardFormSelectProps<T> = Partial<
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value' | 'multiple'>
> & {
  id: string;
  label: string;
  name: string;
  getKey: (data: T) => string;
  getLabel: (data: T) => string;
}
type FormSelectProps<T> = StandardFormSelectProps<T> & {
  multiple: boolean;
  onSelectChange: (v: string[]) => void
  options: T[] | null;
  value: string | number | readonly string[] | undefined;
};

type AdvancedFormSelectProps<T, V> = Omit<StandardFormSelectProps<T>, 'multiple'> & {
  getData: () => Promise<T[]>;
  value?: V;
  onChange: (value: V extends Array<unknown> ? T[] : T) => void;
}

function getSelectedOptions(
  options: HTMLCollectionOf<HTMLOptionElement>
): string[] {
  let result = new Array<string>(options.length);
  for (let i = 0; i < options.length; i++) {
    result[i] = options[i].value;
  }
  return result;
};

export function SingleFormSelect<T>({ value, getData, getKey, onChange, ...rest }: AdvancedFormSelectProps<T, string>) {
  const [selected, setSelected] = useState<string | undefined>(value || undefined);
  const [data] = useAsyncState<T[] | null>(null, getData);

  useEffect(() => {
    // If data is loaded and selected is not defined
    const getReturnValue = (): T => {
      return data?.find((d) => getKey(d) === selected) as T;
    }

    if (!selected && data && data.length > 0) {
      const firstOpt = getKey(data[0]);
      setSelected(firstOpt);
    } else if (selected && data && value !== selected) {
      onChange(getReturnValue());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, data, setSelected]);

  const props = {
    getKey,
    ...rest
  }
  return (
    <FormSelect {...props} options={data} onSelectChange={val => setSelected(val && val.length > 0 ? val[0] : undefined)} value={selected} multiple={false} />
  )
}


export function MultiFormSelect<T>({ value, getData, getKey, onChange, ...rest }: AdvancedFormSelectProps<T, string[]>) {
  const [selected, setSelected] = useState<string[]>(value || []);
  const [data] = useAsyncState<T[] | null>(null, getData);

  useEffect(() => {
    // If data is loaded and selected is not defined
    const getReturnValues = (): T[] => {
      return selected.map((o) => data?.find((d) => getKey(d) === o))
        .filter((d) => d) as T[];
    }

    if (!selected && data && data.length > 0) {
      const firstOpt = getKey(data[0]);
      setSelected([firstOpt]);
    } else if (selected && data && !areArraysEqual(value || [], selected)) {
      onChange(getReturnValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, data, setSelected]);

  const props = {
    getKey,
    ...rest
  }
  return (
    <FormSelect {...props} options={data} onSelectChange={val => setSelected(val)} value={selected} multiple={true} />
  )
}

function FormSelect<T>({
  id,
  label,
  name,
  options,
  multiple,
  value,
  onSelectChange,
  getKey,
  getLabel,
  className,
  ...selectProps
}: FormSelectProps<T>) {
  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        name={name}
        disabled={options === null}
        multiple={multiple}
        onChange={({ target }) =>
          onSelectChange(getSelectedOptions(target.selectedOptions))
        }
        value={value}
        {...selectProps}
      >
        {options !== null &&
          options.map((o) => (
            <option key={getKey(o)} id={getKey(o)} value={getKey(o)}>
              {getLabel(o)}
            </option>
          ))}
      </select>
    </div>
  );
}
