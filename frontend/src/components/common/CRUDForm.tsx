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
import { EnumFactory } from "../../utils/enum";
import { renderComponent } from "../../utils/layout";
import { capitalize } from "../../utils/utils";
import FormInput from "./FormInput";
import { MultiEnumSelect, SingleEnumSelect } from "./select/EnumSelect";

export type BasicFormProps<T> = {
  record: T | null;
} & StandardProps;

export enum FormFieldType {
  STRING = "STRING",
  NUMBER = "NUMBER",
  CHECKBOX = "CHECKBOX",
  DATE = "DATE",
  ENUM_SINGLE = "ENUM_SINGLE",
  ENUM_MULTI = "ENUM_MULTI",
  CUSTOM = "CUSTOM",
}

export type FormField<D, T = unknown> = {
  type: FormFieldType;
  name: keyof D & string;
  id: string;
  label?: string;
  getter?: (r: D) => string | number | readonly string[] | undefined;
  setter?: (
    value: string | number | readonly string[] | boolean | undefined
  ) => unknown;
  // TODO: Remove any
  component?: FunctionComponent<any>;
  factory?: EnumFactory<T>;
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

  function renderSwitch<T>({ type, id, name, props, ...rest }: FormField<D, T>) {
    const setter = rest.setter || ((r) => r);
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
              setFormState({ ...formState, [name]: setter(value) })
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
              setFormState({ ...formState, [name]: setter(+value) })
            }
            {...props}
          />
        );
      case FormFieldType.CHECKBOX:
        return (
          <FormInput
            key={id}
            id={id}
            label={label}
            type="checkbox"
            checked={getter(formState)}
            onChange={(value) => {
              setFormState({ ...formState, [name]: setter(value) })
            }
            }
            {...props}
          />
        );
      case FormFieldType.DATE:

        return (
          <FormInput
            key={id}
            id={id}
            label={label}
            type="date"
            value={getter(formState)}
            onChange={(value) => {
              setFormState({ ...formState, [name]: setter(value) })
            }
            }
            {...props}
          />
        );
      case FormFieldType.ENUM_SINGLE:
        if (!rest.factory) {
          throw new Error(`Incorrect cell definition for ${id}: An enum select should have  a valid enum factory`)
        }
        return (
          <SingleEnumSelect<T>
            key={id}
            id={id}
            label={label}
            onChange={(value) => {
              setFormState({ ...formState, [name]: setter(`${value}`) })
            }}
            value={getter(formState) as string}
            factory={rest.factory}
          />
        )
      case FormFieldType.ENUM_MULTI:
        if (!rest.factory) {
          throw new Error(`Incorrect cell definition for ${id}: An enum select should have  a valid enum factory`)
        }
        return (
          <MultiEnumSelect<T>
            key={id}
            id={id}
            label={label}
            onChange={(values) => {
              setFormState({ ...formState, [name]: setter(values.map(v => `${v}`)) })
            }}
            value={getter(formState) as string}
            factory={rest.factory}
          />
        )
      case FormFieldType.CUSTOM:
        return renderComponent(rest.component || null, {
          id,
          key: id,
          name,
          value: getter(formState),
          onChange: (value: string) =>
            setFormState({ ...formState, [name]: setter(value) }),
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
