import React from 'react'
import LogoutModal from './LogoutModal'
import { ModalProps } from '../../Types/Props/Modal'

const Modal = (ModalProps: ModalProps) => {
    const { type, onClose, onConfirm } = ModalProps;

    return (
        <div className='dark:text-white fixed top-0 right-0 bottom-0 left-0 flex justify-center items-center'>
            {type === "logout" && (
                <LogoutModal onClose={onClose} onConfirm={onConfirm} />
            )}
            <div className='fixed top-0 right-0 left-0 bottom-0 bg-black opacity-25'></div>
        </div>
    )
}

export default Modal

//Error Icon
{/* <svg height="24" version="1.1" width="24" xmlns="http://www.w3.org/2000/svg">
<g transform="translate(0 -1028.4)"><path d="m22 12c0 5.523-4.477 10-10 10-5.5228 0-10-4.477-10-10 0-5.5228 4.4772-10 10-10 5.523 0 10 4.4772 10 10z" fill="#c0392b" transform="translate(0 1029.4)" />
    <path d="m22 12c0 5.523-4.477 10-10 10-5.5228 0-10-4.477-10-10 0-5.5228 4.4772-10 10-10 5.523 0 10 4.4772 10 10z" fill="#e74c3c" transform="translate(0 1028.4)" />
    <path d="m7.0503 1037.8 3.5357 3.6-3.5357 3.5 1.4142 1.4 3.5355-3.5 3.536 3.5 1.414-1.4-3.536-3.5 3.536-3.6-1.414-1.4-3.536 3.5-3.5355-3.5-1.4142 1.4z" fill="#c0392b" />
    <path d="m7.0503 1036.8 3.5357 3.6-3.5357 3.5 1.4142 1.4 3.5355-3.5 3.536 3.5 1.414-1.4-3.536-3.5 3.536-3.6-1.414-1.4-3.536 3.5-3.5355-3.5-1.4142 1.4z" fill="#ecf0f1" />
</g>
</svg> */}