import { useId, useState } from 'react';

import { Dialog } from '../../../../components/ui/Dialog/Dialog';
import { Confirmation } from '../../../../components/ui/Confirmation/Confirmation';

import './TaskForm.css';

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
    const dialogTitleId = formId;

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
        <div className="task-form">
            {!isEditing && (
                <button type="button" onClick={() => setIsOpen(true)}>
                    Add task
                </button>
            )}

            <Dialog isOpen={isOpen}
                onRequestClose={handleClose}
                aria-labelledby={dialogTitleId}>

                <h2 id={dialogTitleId}>
                    {isEditing ? "Edit task" : "Add task"}
                </h2>

                {showDiscardConfirmation ? (
                    <Confirmation onConfirm={closeForm}
                        onCancel={handleConfirmationCancel}
                        message="Discard changes ?"
                    />
                ) : (
                    <form className="task-form-content" onSubmit={handleSubmit}>
                        <div className="form-field">
                            <label htmlFor={titleId}>
                                Title
                            </label>
                            <input className="form-control" id={titleId} required
                                value={title} onChange={(e) => setTitle(e.target.value)}/>
                        </div>

                        <div className="form-field">
                            <label htmlFor={descriptionId}>
                                Description
                            </label>
                            <textarea className="form-control" id={descriptionId}
                                value={description} onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {formError && <p className="form-error" role="alert">{formError}</p>}

                        <div className="task-form-actions">
                            <button type="button" onClick={handleClose}>
                                Cancel
                            </button>
                            <button type="submit" className="primary-button">
                                {isEditing ? "Save task" : "Add task"}
                            </button>
                        </div>
                    </form>
                )}

            </Dialog>
        </div>
    );
}