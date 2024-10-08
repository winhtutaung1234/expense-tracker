import React from 'react'
import { ModalProps } from '../../Types/Props/Modal';

const WarningModal = (WarningModalProps: Omit<ModalProps, "type">) => {
    const { onClose, onConfirm, text, cancelButtonText, confirmButtonText } = WarningModalProps;
    return (
        <div className='bg-gray flex flex-col gap-5 rounded-xl overflow-hidden z-10'>
            <div className='flex md:gap-5 gap-3 items-center bg-[#FF9800] py-3 md:px-8 px-4'>
                <svg className='md:w-[35px] w-[30px] fill-current text-white animate-ping' viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <g data-name="Layer 58" id="Layer_58"><path className="cls-1" d="M16,26a2,2,0,1,1,2-2A2,2,0,0,1,16,26Zm0-2Z" />
                        <path className="cls-1" d="M16,20a1,1,0,0,1-1-1V11a1,1,0,0,1,2,0v8A1,1,0,0,1,16,20Z" />
                        <path className="cls-1" d="M27.78,30H4.22a3.19,3.19,0,0,1-2.77-1.57,3.13,3.13,0,0,1-.06-3.13L13.17,3.67a3.23,3.23,0,0,1,5.66,0L30.61,25.3a3.13,3.13,0,0,1-.06,3.13A3.19,3.19,0,0,1,27.78,30ZM16,4a1.18,1.18,0,0,0-1.07.63L3.15,26.25a1.12,1.12,0,0,0,0,1.16,1.19,1.19,0,0,0,1,.59H27.78a1.19,1.19,0,0,0,1-.59,1.12,1.12,0,0,0,0-1.16L17.07,4.63A1.18,1.18,0,0,0,16,4Z" />
                    </g>
                </svg>
                <p className='md:text-[24px] text-[20px] font-inter font-bold'>Warning, This action cannot be undone!</p>
            </div>
            <p className='md:text-[16px] font-montserrat md:px-8 px-4'>{text || "This Action cannot be undone!"}</p>
            <div className='md:px-8 px-4 mb-6 flex justify-end gap-4'>
                <button onClick={onClose} className='bg-[#FFF3E0] hover:bg-[#b9b1a2] transition-all text-black py-1 px-4 rounded-md shadow-md font-montserrat'>{cancelButtonText || "Cancel"}</button>
                <button onClick={onConfirm} className='bg-[#FF9800] hover:bg-[#ffb950] transition-all py-1 px-4 rounded-md shadow-md font-montserrat'>{confirmButtonText || "Confirm"}</button>
            </div>
        </div>
    )
}

export default WarningModal