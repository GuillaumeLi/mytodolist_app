import { TaskItem } from '../TaskItem/TaskItem';

import './TaskList.css';

export function TaskList({ tasks, onDeleteTask, onToggleTaskCompletion, onEditTask, isDeletingTask, isEditingTask, togglingTaskId }) {

    return (
        <div className="task-list">
            {tasks.map( task => (
                <TaskItem 
                    key={task.id} 
                    task={task} 
                    onDeleteTask={onDeleteTask} 
                    onToggleTaskCompletion={onToggleTaskCompletion} 
                    onEditTask={onEditTask}
                    isDeletingTask={isDeletingTask}
                    isEditingTask={isEditingTask}
                    togglingTaskId={togglingTaskId}
                />
            ))}
        </div>
    );
}
