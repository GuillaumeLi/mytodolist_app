import { useState } from 'react';

import { TaskForm } from './TaskForm';
import { Dialog } from './Dialog';
import { Confirmation } from './Confirmation';
import '../App.css';

export function TaskItem({ task, onDeleteTask, onToggleTaskCompletion, onEditTask }) {
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const [deleteError, setDeleteError] = useState(null);
    const [toggleError, setToggleError] = useState(null);

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

            {toggleError && <p role="alert">{toggleError}</p>}

            <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={(e) => handleToggleTaskCompletion(task.id, e.target.checked)}
                aria-label={
                    task.completed
                        ? `Mark ${task.title} as incomplete`
                        : `Mark ${task.title} as complete`
                }/>

            <div>
                <h3>{task.title}</h3>
                {task.description && (<p>{task.description}</p>)}
            </div>

            <button type="button" onClick={() => setIsEditing(true)}>
                Edit
            </button>

            {isEditing && (
                <TaskForm 
                    task={task}
                    onSubmit={(newTitle, newDescription) => onEditTask(task.id, newTitle, newDescription)}
                    onClose={() => setIsEditing(false)}
                />
            )}

            <button type="button" onClick={() => setShowDeleteConfirmation(true)}>
                Delete
            </button>

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