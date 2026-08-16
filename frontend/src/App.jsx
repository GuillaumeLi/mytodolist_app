import { useState } from 'react';

import { TaskForm } from './components/TaskForm';
import TaskList from './components/TaskList';

function App() {
  
  const [tasks, setTasks] = useState(exampleTasks);
  const [showForm, setShowForm] = useState(false);

  function handleAddTask(title, description) {
    const newTask = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false
    };
    setTasks([...tasks, newTask]);
  }

  function handleDeleteTask(id) {
    setTasks(tasks.filter(task => task.id !== id));
  }

  function handleToggleTaskCompletion(id, completed) {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed : completed} : task));
  }

  return (
    <div>
      <h1>My To-Do List</h1>
      <button onClick={() => setShowForm(true)}>Add task</button>
      {showForm && (<TaskForm onAddTask={handleAddTask} onClose={() => setShowForm(false)} />)}
      <TaskList tasks={tasks} onDeleteTask={handleDeleteTask} onToggleTaskCompletion={handleToggleTaskCompletion} onEditTask={handleEditTask} />
    </div>
  );
}


const exampleTasks = [
  { id : crypto.randomUUID(), title: 'Task 1', description: 'Description for Task 1', completed: false },
  { id : crypto.randomUUID(), title: 'Task 2', description: 'Description for Task 2', completed: true },
  { id : crypto.randomUUID(), title: 'Task 3', description: 'Description for Task 3', completed: false },
  { id : crypto.randomUUID(), title: 'Task 4', description: 'Description for Task 4', completed: true },
  { id : crypto.randomUUID(), title: 'Task 5', description: 'Description for Task 5', completed: false },
];

export default App;