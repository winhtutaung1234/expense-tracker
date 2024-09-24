import { Errors } from "../../Types/Error";

const getError = (errors: Errors) => {
    const allErrors = errors.errors;
    const formError = allErrors.reduce((acc: { [key: string]: string[] }, err) => {
        acc[err.field] = [err.msg];
        return acc;
    }, {});
    return formError;
}

export default getError;