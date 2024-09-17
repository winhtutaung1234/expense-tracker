type ModalProps = {
    type: "logout" | "confirmation" | "warning";
    text?: string;
    onClose: () => void;
    onConfirm: () => void;
    cancelButtonText?: string;  
    confirmButtonText?: string;
}

export default ModalProps;