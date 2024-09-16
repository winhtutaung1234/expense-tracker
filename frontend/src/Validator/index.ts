const Validator = <T>(
    data: T,
    validations: Record<keyof T, string | string[]>,
    setError: (errors: Partial<Record<keyof T, string[]>>) => void
) => {
    let continueProcess = true;
    let Errors: Partial<Record<keyof T, string[]>> = {};

    (Object.keys(validations) as Array<keyof T>).forEach((key) => {
        let validationRules: string[] = [];

        if (Array.isArray(validations[key])) {
            validationRules = validations[key] as string[];
        } else {
            validationRules = (validations[key] as string).split('|');
        }

        validationRules.forEach((rule) => {
            const formattedKey = String(key);
            const capitalizedKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
            if (!Errors[key]) {
                Errors[key] = [];
            }

            if (rule === "required") {
                if (!RequiredRule(data[key as keyof T] as string | number | boolean)) {
                    Errors[key]!.push(`${capitalizedKey} is required.`);
                    continueProcess = false;
                }
            }

            if (rule.startsWith("min")) {
                const [_, length] = rule.split(':');
                const minLength = parseInt(length, 10);
                if (!MinRule(minLength, data[key as keyof T] as string | number)) {
                    Errors[key]!.push(`${capitalizedKey} must be at least ${minLength}.`);
                    continueProcess = false;
                }
            }

            if (rule === "number") {
                if (!numberRule(data[key as keyof T] as string | number)) {
                    Errors[key]!.push(`${capitalizedKey} must be a number.`);
                }
            }
        });
    });

    setError(Errors);
    return continueProcess;
};



const RequiredRule = (value: string | number | boolean): Boolean => {
    return Boolean(value);
}

const MinRule = (length: number, value: string | number): Boolean => {
    if (typeof value === "number") {
        return Boolean(value >= length);
    }
    if (typeof value === "string") {
        return Boolean(value.length >= length);
    }
    return false;
}

const numberRule = (value: string | number): Boolean => {
    return Boolean(Number(value));
}

export default Validator;