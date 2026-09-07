import { useEffect, useState } from 'react';

import { TaskForm } from './components/TaskForm';
import TaskList from './components/TaskList';

function App() {
  
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch tasks from the backend (GET request) when the component mounts
  useEffect(() => {
    async function fetchTasks () {
      try {
        const response = await fetch("http://localhost:3000/tasks");
  
        if(!response.ok) {
          const errorData = await response.json();
          setError(errorData.message);
          return;
        }
  
        const data = await response.json();
        setTasks(data);
        
      } catch (error) {
        setError("Can't communicate with the server");
      }
    }
    fetchTasks();
  }, []);

  // Function to handle adding a new task
  async function handleAddTask(title, description) {
    const newTask = {
        title,
        description,
    };

    try{
      // Send the new task to the backend (POST request)
      const response = await fetch("http://localhost:3000/tasks", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(newTask)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message);
        return;
      }
  
      // Get the created task from the response (with the id and completed status assigned by the backend)
      const createdTask = await response.json();
      setTasks(prevTasks => [...prevTasks, createdTask]);

    } catch (error) {
      setError("Can't communicate with the server");
    }
  }

  async function handleDeleteTask(id) {
    try {
      // Send a DELETE request to the backend to delete the task
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
          method: "DELETE"
      });
  
      // If the deletion was successful, update the state to remove the task from the list
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message);
        return;
      }

      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));

    } catch (error) {
      setError("Can't communicate with the server");
    }
}

  async function handleToggleTaskCompletion(id, completed) {
    try {
      // Send a PATCH request to the backend to update the task's completion status
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ completed: completed })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message);
        return;    
      }
      
      // If the update was successful, update the state to reflect the change
      const updatedTask = await response.json();
      setTasks(prevTasks => prevTasks.map(task => task.id === id ? updatedTask : task));
    
    } catch (error) {
      setError("Can't communicate with the server");
    }
  }

  async function handleEditTask(id, newTitle, newDescription) {
    try {
      // Send a PATCH request to the backend to update the task's information
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ 
            title: newTitle,
            description: newDescription
          })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message);
        return;
      }
      
      // If the update was successful, update the state to reflect the change
      const updatedTask = await response.json();
      setTasks(prevTasks => prevTasks.map(task => task.id === id ? updatedTask : task));
      
    } catch (error) {
      setError("Can't communicate with the server");
    }
  }

  return (
    <div>
      <h1>My To-Do List</h1>
      {error && <p>{error}</p>}
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