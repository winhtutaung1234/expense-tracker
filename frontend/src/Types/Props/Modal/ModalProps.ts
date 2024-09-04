type ModalProps = {
    type: "logout" | "confirmation";
    onClose: () => void;
    onConfirm: () => void;
}

export default ModalProps;