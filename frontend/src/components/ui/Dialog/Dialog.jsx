import { useEffect, useRef } from "react";

import './Dialog.css';

export function Dialog ({ isOpen, onRequestClose, children, ...dialogProps }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) {
            return;
        }

        if (isOpen && !dialog.open) {
            dialog.showModal();
        }

        if (!isOpen && dialog.open) {
            dialog.close();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        function handleKeyDown(e) {
            if (e.key !== 'Escape') {
                return;
            }

            e.preventDefault();
            e.stopPropagation();
            onRequestClose();
        }

        document.addEventListener('keydown', handleKeyDown, true);

        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
        };
    }, [isOpen, onRequestClose]);

    function handleCancel(e) {
        e.preventDefault();
    }

    return (
        <dialog {...dialogProps} 
            className="dialog"
            ref={dialogRef}
            onCancel={handleCancel}
        >
            {children}
        </dialog>
    );
}