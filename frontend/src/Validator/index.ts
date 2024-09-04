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
            if (rule === "required") {
                if (!RequiredRule(data[key as keyof T] as string | number | boolean)) {
                    if (!Errors[key]) {
                        Errors[key] = [];
                    }
                    const formattedKey = String(key);
                    const capitalizedKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
                    Errors[key]!.push(`${capitalizedKey} is required.`);
                    continueProcess = false;
                }
            }

            if (rule.startsWith("min")) {
                const [_, length] = rule.split(':');
                const minLength = parseInt(length, 10);
                if (!MinRule(minLength, data[key as keyof T] as string | number)) {
                    if (!Errors[key]) {
                        Errors[key] = [];
                    }
                    const formattedKey = String(key);
                    const capitalizedKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
                    Errors[key]!.push(`${capitalizedKey} must be at least ${minLength}.`);
                    continueProcess = false;
                }
            }
        });
    });

    setError(Errors);
    return continueProcess;
};



const RequiredRule = (value: string | number | boolean) => {
    return Boolean(value);
}

const MinRule = (length: number, value: string | number) => {
    if (typeof value === "number") {
        return Boolean(value >= length);
    }
    if (typeof value === "string") {
        return Boolean(value.length >= length);
    }
}

export default Validator;