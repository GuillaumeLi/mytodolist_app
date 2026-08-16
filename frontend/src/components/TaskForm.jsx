import React, { useState } from 'react';

export function TaskForm({ onAddTask, onClose }) {
    const [title, setTitle] = useState(currentTitle);
    const [description, setDescription] = useState(currentDescription);


    return (
        <dialog open>
            <form onSubmit={(e) => {
                e.preventDefault();
                onAddTask(title.trim(), description.trim());
                setTitle('');
                setDescription('');
                onClose();
            }}>
                <label>Title:</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <br />
                <label>Description:</label>
                <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <br />
                <button type="submit">Add Task</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </dialog>
    )
}
