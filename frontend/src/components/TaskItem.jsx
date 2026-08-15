import React, { useState } from 'react';
import '../App.css';

export function TaskItem({ task, onDeleteTask, onToggleTaskCompletion }) {
    return (
        <section className="task-item">
            <input type="checkbox" checked={task.completed} onChange={e => onToggleTaskCompletion(task.id, e.target.checked)} />
            {task.title} {task.description} {task.completed ? '✅' : '❌'}
            <button onClick={() => onDeleteTask(task.id)}>Delete</button>
        </section>
    );
}