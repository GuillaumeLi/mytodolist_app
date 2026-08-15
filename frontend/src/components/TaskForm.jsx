import React, { useState } from 'react';

export function TaskForm({ onAddTask }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');


    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault();
                onAddTask(title.trim(), description.trim());
                setTitle('');
                setDescription('');
            }}>
                <input
                    placeholder="Enter task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    placeholder="Enter task description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button type="submit">Add Task</button>
            </form>
        </div>
    )
}
