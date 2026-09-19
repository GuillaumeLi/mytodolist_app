import { useId, useState } from 'react';

import { Dialog } from './Dialog';
import { Confirmation } from './Confirmation';

export function TaskForm ({ task = null, onSubmit, onClose }) {
    const [title, setTitle] = useState(task?.title ?? '');
    const [description, setDescription] = useState(task?.description ?? "");

    const [isOpen, setIsOpen] = useState(Boolean(task));
    const [formError, setFormError] = useState(null);
    const [showDiscardConfirmation, setShowDiscardConfirmation] = useState(false);

    const isEditing = task !== null;
    const hasChanges = isEditing && (title !== (task?.title ?? '') || description !== (task?.description ?? ''));

    const formId = useId();
    const titleId = `${formId}-title`;
    const descriptionId = `${formId}-description`;

    function resetForm() {
        setTitle(task?.title ?? '');
        setDescription(task?.description ?? '');
        setFormError(null);
    }

    function closeForm() {
        resetForm();
        setIsOpen(false);
        setShowDiscardConfirmation(false);
        onClose?.();
    }

    function handleClose() {
        if (showDiscardConfirmation) {
            setShowDiscardConfirmation(false);
            return;
        }

        if (isEditing && hasChanges) {
            setShowDiscardConfirmation(true);
            return;
        }
        closeForm();
    }

    function handleConfirmationCancel() {
        setShowDiscardConfirmation(false);
        setFormError(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setFormError(null);

        try {
            await onSubmit(title.trim(), description.trim());
            closeForm();
        } catch (error) {
            setFormError(error.message);
        }
    }

    return (
        <div>
            {!isEditing && (
                <button type="button" onClick={() => setIsOpen(true)}>
                    Add task
                </button>
            )}

            <Dialog isOpen={isOpen}
                onRequestClose={handleClose}>

                {showDiscardConfirmation ? (
                    <Confirmation onConfirm={closeForm}
                        onCancel={handleConfirmationCancel}
                        message="Discard changes ?"
                    />
                ) : (
                    <form onSubmit={handleSubmit}>
                        <label htmlFor={titleId}>
                            Title
                        </label>
                        <input id={titleId} required
                            value={title} onChange={(e) => setTitle(e.target.value)}/>

                        <label htmlFor={descriptionId}>
                            Description
                        </label>
                        <textarea id={descriptionId}
                            value={description} onChange={(e) => setDescription(e.target.value)}
                        />

                        {formError && <p role="alert">{formError}</p>}

                        <button type="button" onClick={handleClose}>
                            Cancel
                        </button>
                        <button type="submit">
                            {isEditing ? "Save task" : "Add task"}
                        </button>
                    </form>
                )}

            </Dialog>
        </div>
    );
}