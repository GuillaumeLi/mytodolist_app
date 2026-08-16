import React, { useState } from 'react';
import { TaskForm } from './TaskForm';
import '../App.css';

export function TaskItem({ task, onDeleteTask, onToggleTaskCompletion, onEditTask }) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <section className="task-item">
            <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={e => onToggleTaskCompletion(task.id, e.target.checked)} />
            {task.title} {task.description} {task.completed ? '✅' : '❌'}
            <button onClick={() => setIsEditing(true)}>
                Edit
            </button>
            {isEditing && (
                <TaskForm 
                    onSubmit={(newTitle, newDescription) => {
                        onEditTask(task.id, newTitle, newDescription);
                    }} 
                    currentTitle={task.title} 
                    currentDescription={task.description} 
                    isEditing={true}
                    onClose={() => setIsEditing(false)} />
            )}
            <button onClick={() => onDeleteTask(task.id)}>
                Delete
            </button>
        </section>
    );
}