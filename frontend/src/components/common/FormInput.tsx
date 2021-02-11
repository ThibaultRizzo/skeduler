import React from "react";

type FormInputProps = Partial<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">
> & {
  id: string;
  label: string;
  onChange: (value: string | boolean) => void;
};

export default function FormInput({
  id,
  label,
  onChange,
  ...inputProps
}: FormInputProps) {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        type="text"
        {...inputProps}
        name={id}
        id={id}
        onChange={({ target }) => onChange(inputProps.type && inputProps.type === 'checkbox' ? target.checked : target.value)}
      />
    </>
  );
}
