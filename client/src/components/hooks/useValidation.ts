import { useState } from "react";

export type ErrorDictionary = { [key: string]: string };
export type Errors = { errors: ErrorDictionary, isValid: boolean };


function useValidation(validationFn: () => ErrorDictionary): [Errors, () => void] {
    const [validation, setErrors] = useState<Errors>({ errors: {}, isValid: true });
    const validate = () => {
        const validationErrors = validationFn();
        setErrors({ errors: validationErrors, isValid: Object.keys(validationErrors).length === 0 });
    };

    return [validation, validate]
}

export default useValidation;