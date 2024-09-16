import { useEffect, useState } from 'react'
import ErrorProps from '../../Types/Props/Errors'

const Error = (props: ErrorProps) => {
    const { allErrors, showError } = props;
    const [errorMessage, setErrorMessage] = useState<string | undefined | null>();

    useEffect(() => {
        if (allErrors && allErrors[showError]) {
            setErrorMessage(allErrors[showError].join(" "))
        } else {
            setErrorMessage(null);
        }
    }, [allErrors, showError])

    if (errorMessage) {
        return (
            <div className='text-red-500 self-start m-0 p-0'>{errorMessage}</div>
        )
    }
}

export default Error