import { TaskItem } from '../TaskItem/TaskItem';

import './TaskList.css';

export function TaskList({ tasks, onDeleteTask, onToggleTaskCompletion, onEditTask }) {

    return (
        <div className="task-list">
            {tasks.map( task => (
                <TaskItem 
                    key={task.id} 
                    task={task} 
                    onDeleteTask={onDeleteTask} 
                    onToggleTaskCompletion={onToggleTaskCompletion} 
                    onEditTask={onEditTask}
                />
            ))}
        </div>
    );
}
