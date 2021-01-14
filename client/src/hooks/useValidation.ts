import { useState } from "react";

export type ErrorDictionary = { [key: string]: string };
export type Errors = { errors: ErrorDictionary, isValid: boolean };


function useValidation<T>(validationFn: (record: T) => ErrorDictionary): [Errors, (record: T) => void] {
    const [validation, setErrors] = useState<Errors>({ errors: {}, isValid: true });
    const validate = (record: T) => {
        const validationErrors = validationFn(record);
        setErrors({ errors: validationErrors, isValid: Object.keys(validationErrors).length === 0 });
    };

    return [validation, validate]
}

export default useValidation;