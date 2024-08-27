const Validator = <T>(
    data: T,
    validations: Record<keyof T, string | string[]>,
    setError: (errors: Partial<Record<keyof T, string[]>>) => void
) => {
    let continueProcess = true;
    let Errors: Partial<Record<keyof T, string[]>> = {};

    (Object.keys(validations) as Array<keyof T>).forEach((key) => {
        let validationRules = [];

        if (Array.isArray(validations[key])) {
            validationRules = validations[key];
        } else {
            validationRules = validations[key].split('|');
        }

        validationRules.forEach((rule) => {
            if (rule === "required") {
                if (!RequiredRule(data[key as keyof T] as string | number | boolean)) {
                    if (!Errors[key]) {
                        Errors[key] = [];
                    }
                    const formattedKey = String(key);
                    const capitalizedKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
                    Errors[key]!.push(`${capitalizedKey} is required`);
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

export default Validator;