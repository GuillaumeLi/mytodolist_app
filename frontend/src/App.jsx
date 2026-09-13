import { useEffect, useState } from 'react';

import { TaskForm } from './components/TaskForm';
import TaskList from './components/TaskList';

function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // Pagination useStates
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [completedFilter, setCompletedFilter] = useState("");
  const [sort, setSort] = useState("title");
  const [order, setOrder] = useState("asc");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch tasks from the backend (GET request) when the component mounts
  useEffect(() => {
    async function fetchTasks () {
      setError(null);
      setLoading(true);
      try {
        const urlParams = new URLSearchParams();
        
        urlParams.set("page", currentPage);
        urlParams.set("limit", pageSize);
        urlParams.set("sort", sort);
        urlParams.set("order", order);
        if (debouncedSearch) {
          urlParams.set("search", debouncedSearch);
        }
        if (completedFilter) {
          urlParams.set("completed", completedFilter);
        }
      
        const url = `http://localhost:3000/tasks?${urlParams}`;
        const response = await fetch(url);
  
        if(!response.ok) {
          const errorData = await response.json();
          setError(errorData.message);
          return;
        }
  
        const data = await response.json();
        setTasks(data.tasks);
        setPagination(data.pagination);
        
      } catch (error) {
        setError("Can't communicate with the server");
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, [currentPage, pageSize, debouncedSearch, completedFilter, sort, order]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [search]);

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

      <input value={search} 
        onChange={(e) => {
          setSearch(e.target.value);
        }}>
      </input>

      <select value={completedFilter}
        onChange={(e) => {
          setCompletedFilter(e.target.value);
          setCurrentPage(1);
        }}>
        <option value="">All tasks</option>
        <option value="true">Completed</option>
        <option value="false">Not completed</option>
      </select>
      
      <select value={sort}
        onChange={(e) => {
          setSort(e.target.value);
          setCurrentPage(1);
        }}>
        <option value="title">Title</option>
        <option value="completed">Status</option>
      </select>

      <select value={order}
        onChange={(e) => {
          setOrder(e.target.value);
          setCurrentPage(1);
        }}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>

      <br></br>

      <button onClick={() => setShowForm(true)}>
        Add task
      </button>

      <div className="loading-container">
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!error && !loading && tasks.length === 0 && <p>No tasks found</p>}
      </div>

      {showForm && (
        <TaskForm onSubmit={handleAddTask} onClose={() => setShowForm(false)} />
      )}

      <TaskList 
        tasks={tasks} 
        onDeleteTask={handleDeleteTask} 
        onToggleTaskCompletion={handleToggleTaskCompletion} 
        onEditTask={handleEditTask}>
      </TaskList>

      {pagination && pagination.totalPages > 1 && (
        <div>
          <label>
            Tasks per page : 
            <select value={pageSize} 
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);}}>
              <option value="2">2</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </label>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prevPage => prevPage - 1)}>
            Previous
          </button>
          <span>Page {currentPage} of {pagination.totalPages}</span>
          <button disabled={currentPage >= pagination.totalPages} onClick={() => setCurrentPage(prevPage => prevPage + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default App;