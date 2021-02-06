import {
  Attributes,
  Dispatch,
  FormEvent,
  FunctionComponent,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import useValidation, { ErrorDictionary } from "../../hooks/useValidation";
import { StandardProps } from "../../types/types";
import { renderComponent } from "../../utils/layout";
import { capitalize } from "../../utils/utils";
import FormInput from "./FormInput";

export type BasicFormProps<T> = {
  record: T | null;
} & StandardProps;

export enum FormFieldType {
  STRING = "STRING",
  NUMBER = "NUMBER",
  CUSTOM = "CUSTOM",
}

export type FormField<D> = {
  type: FormFieldType;
  name: string;
  id: string;
  label?: string;
  getter?: (r: D) => string | number | readonly string[] | undefined;
  format?: (
    value: string | number | readonly string[] | undefined
  ) => string | number | readonly string[] | undefined;
  // TODO: Remove any
  component?: FunctionComponent<any>;
  props?: any;
} & Attributes &
  StandardProps;

export type CRUDFormProps<D> = {
  isCreation: boolean;
  name: string;
  validateForm: (record: D) => ErrorDictionary;
  createOne: (record: D) => void;
  updateOne: (record: D) => void;
  fields: FormField<D>[];
  initialState: D;
  children?: (
    value: D,
    onChange: Dispatch<SetStateAction<D>>
  ) => ReactNode | null;
} & StandardProps;

function CRUDForm<D>({
  isCreation,
  name,
  validateForm,
  createOne,
  updateOne,
  children,
  fields,
  initialState,
}: CRUDFormProps<D>) {
  const [formState, setFormState] = useState<D>(initialState);
  const [validation, validate] = useValidation(validateForm);

  function resetFormState() {
    if (isCreation) {
      setFormState(initialState);
    }
  }
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    validate(formState);
    if (validation.isValid) {
      if (isCreation) {
        createOne(formState);
      } else {
        updateOne(formState);
      }
      resetFormState();
    } else {
      alert("Something went wrong");
    }
  }

  function renderSwitch({ type, id, name, props, ...rest }: FormField<D>) {
    const format = rest.format || ((r) => r);
    const getter = rest.getter || ((r: D) => r[name as keyof D]);
    const label = rest.label || capitalize(name);
    switch (type) {
      case FormFieldType.STRING:
        return (
          <FormInput
            id={id}
            key={id}
            label={label}
            value={getter(formState) as string}
            onChange={(value) =>
              setFormState({ ...formState, [name]: format(value) })
            }
            {...props}
          />
        );
      case FormFieldType.NUMBER:
        return (
          <FormInput
            key={id}
            id={id}
            label={label}
            type="number"
            value={getter(formState) as number}
            onChange={(value) =>
              setFormState({ ...formState, [name]: format(+value) })
            }
            {...props}
          />
        );
      case FormFieldType.CUSTOM:
        return renderComponent(rest.component || null, {
          id,
          key: id,
          name,
          value: getter(formState),
          onChange: (value: string) =>
            setFormState({ ...formState, [name]: format(value) }),
          ...props,
        });
    }
  }

  return (
    <div>
      <h1>{`${isCreation ? "Create" : "Update"} ${name}`}</h1>
      <form onSubmit={onSubmit}>
        <div>
          {Object.entries(validation.errors).map(([field, error], i) => (
            <h4 key={field + i}>
              {field}:{error}
            </h4>
          ))}
        </div>
        {fields.map((field) => renderSwitch(field))}
        {children && children(formState, setFormState)}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CRUDForm;
