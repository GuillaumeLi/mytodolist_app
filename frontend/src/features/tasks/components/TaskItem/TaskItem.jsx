import { useState, useId } from 'react';

import { Pencil, Trash2, ChevronRight } from 'lucide-react';

import { TaskForm } from '../TaskForm/TaskForm';
import { Dialog } from '../../../../components/ui/Dialog/Dialog';
import { Confirmation } from '../../../../components/ui/Confirmation/Confirmation';

import "./TaskItem.css";

export function TaskItem({ task, onDeleteTask, onToggleTaskCompletion, onEditTask }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const [deleteError, setDeleteError] = useState(null);
    const [toggleError, setToggleError] = useState(null);

    const detailsId= useId();
    const hasDetails= Boolean(task.description);

    async function handleConfirmDelete() {
        setDeleteError(null);
        try {
            await onDeleteTask(task.id);
            setShowDeleteConfirmation(false);
        } catch (error) {
            setDeleteError(error.message);
        }
    }

    function handleCancelDelete() {
        setDeleteError(null);
        setShowDeleteConfirmation(false);
    }

    async function handleToggleTaskCompletion(id, completed) {
        setToggleError(null);
        try {
            await onToggleTaskCompletion(id, completed);
        } catch(error) {
            setToggleError(error.message);
        }
    }

    return (
        <article className="task-item">

            <div className="task-row">
                <input className="task-checkbox"
                    type="checkbox" 
                    checked={task.completed} 
                    onChange={(e) => handleToggleTaskCompletion(task.id, e.target.checked)}
                    aria-label={
                        task.completed
                        ? `Mark ${task.title} as incomplete`
                        : `Mark ${task.title} as complete`
                    }
                    />

                <button className="task-expand-button"
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={detailsId}
                    onClick={() => setIsExpanded(prevExpanded => !prevExpanded)}
                >    
                    <span className={`task-title ${task.completed ? 'task-title-completed' : ''}`}>
                        {task.title}
                    </span>

                    {hasDetails ? (
                        <ChevronRight className="task-expand-icon"
                            size={18}
                            aria-hidden="true"
                        />
                    ) : null}
                </button>

                <div className="task-actions">
                    <button aria-label={`Edit ${task.title}`}
                        type="button"
                        onClick={() => setIsEditing(true)}
                    >
                        <Pencil size={18} aria-hidden="true"/>
                    </button>

                    <button className="delete-button"
                        aria-label={`Delete ${task.title}`}
                        type="button"
                        onClick={() => setShowDeleteConfirmation(true)}
                    >
                        <Trash2 size={18} aria-hidden="true"/>
                    </button>
                </div>
            </div>

            {toggleError && <p className="task-error" role="alert">{toggleError}</p>}
            
            {isExpanded && hasDetails ? (
                <div className="task-details" id={detailsId}>
                    {task.description && (<p>{task.description}</p>)}
                </div>
            ) : null }

            {isEditing && (
                <TaskForm 
                    task={task}
                    onSubmit={(newTitle, newDescription) => onEditTask(task.id, newTitle, newDescription)}
                    onClose={() => setIsEditing(false)}
                />
            )}

            <Dialog isOpen={showDeleteConfirmation}
                onRequestClose={handleCancelDelete}>

                <Confirmation message="Are you sure you want to delete this task ?"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />

                {deleteError && <p role="alert">{deleteError}</p>}

            </Dialog>
        </article>
    );
}