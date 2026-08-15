import { TaskItem } from './TaskItem';

export default function TaskList({ tasks, onDeleteTask, onToggleTaskCompletion }) {

    return (
        <div>
            {tasks.map( task => (
                <TaskItem key={task.id} task={task} onDeleteTask={onDeleteTask} onToggleTaskCompletion={onToggleTaskCompletion} />
            ))}
        </div>
    );
}
