import { TaskItem } from './TaskItem';

export default function TaskList({ tasks, onDeleteTask, onToggleTaskCompletion, onEditTask }) {

    return (
        <div>
            {tasks.map( task => (
                <TaskItem 
                    key={task.id} 
                    task={task} 
                    onDeleteTask={onDeleteTask} 
                    onToggleTaskCompletion={onToggleTaskCompletion} 
                    onEditTask={onEditTask} />
            ))}
        </div>
    );
}
