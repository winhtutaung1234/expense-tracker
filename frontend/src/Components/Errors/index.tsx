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

    return (
        <div className='text-red-500 self-start'>{errorMessage}</div>
    )
}

export default Error