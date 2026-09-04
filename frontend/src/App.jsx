import { useEffect, useState } from 'react';

import { TaskForm } from './components/TaskForm';
import TaskList from './components/TaskList';

function App() {
  
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Fetch tasks from the backend (GET request) when the component mounts
  useEffect(() => {
    fetch("http://localhost:3000/tasks")
      .then(response => response.json())
      .then(data => {
        setTasks(data);
      });
  }, []);

  // Function to handle adding a new task
  async function handleAddTask(title, description) {
    const newTask = {
        title,
        description,
    };

    // Send the new task to the backend (POST request)
    const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newTask)
    });

    // Get the created task from the response (with the id and completed status assigned by the backend)
    const createdTask = await response.json();

    setTasks([...tasks, createdTask]);
  }

  async function handleDeleteTask(id) {
    // Send a DELETE request to the backend to delete the task
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE"
    });

    // If the deletion was successful, update the state to remove the task from the list
    if (response.ok) {
        setTasks(tasks.filter(task => task.id !== id));
    }
}

  function handleToggleTaskCompletion(id, completed) {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed : completed} : task));
  }

  function handleEditTask(id, newTitle, newDescription) {
    setTasks(tasks.map(task => task.id === id ? { ...task, title: newTitle, description: newDescription } : task));
  }

  return (
    <div>
      <h1>My To-Do List</h1>
      <button onClick={() => setShowForm(true)}>Add task</button>
      {showForm && (
        <TaskForm onSubmit={handleAddTask} onClose={() => setShowForm(false)} />
      )}
      <TaskList 
        tasks={tasks} 
        onDeleteTask={handleDeleteTask} 
        onToggleTaskCompletion={handleToggleTaskCompletion} 
        onEditTask={handleEditTask} />
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