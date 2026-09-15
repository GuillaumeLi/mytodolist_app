import { useState, useEffect } from "react";

import { getTasks, addTask, deleteTask, toggleTaskCompletion, editTask } from "../services/tasksApi";

function useTasks () {
    const [tasks, setTasks] = useState([]);
    
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Pagination useStates
    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(2);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [completedFilter, setCompletedFilter] = useState("");
    const [sort, setSort] = useState("title");
    const [order, setOrder] = useState("asc");

    // Debounce effect when user is writing in the search bar
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
        setDebouncedSearch(search);
        setCurrentPage(1);
        }, 300);

        return () => {
        clearTimeout(debounceTimer);
        };
    }, [search]);

    // Function to load tasks after each action
    async function loadTasks () {
        setError(null);
        setLoading(true);
        try {
            const data = await getTasks({currentPage, pageSize, search: debouncedSearch, completedFilter, sort, order});
            setTasks(data.tasks);
            setPagination(data.pagination);

            if (data.pagination.totalPages === 0) {
                if (currentPage !== 0) {
                    setCurrentPage(1);
                }
            } else if (currentPage > data.pagination.totalPages) {
                setCurrentPage(data.pagination.totalPages);
            }

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    // Fetch tasks from the backend (GET request) when the component mounts
    useEffect(() => {
        loadTasks();
    }, [currentPage, pageSize, debouncedSearch, completedFilter, sort, order]);

    // Function to handle adding a new task
    async function handleAddTask (title, description) {
        try {
            await addTask(title, description);
            await loadTasks();
        } catch (error) {
            setError(error.message);
        }
    }

    // Function to handle deleting a task
    async function handleDeleteTask (id) {
        try {
            await deleteTask(id);
            await loadTasks();
        } catch (error) {
            setError(error.message);
        }
    }

    // Function to handle task completion
    async function handleToggleTaskCompletion(id, completed) {
        try {
            await toggleTaskCompletion(id, completed);
            await loadTasks();
        } catch (error) {
            setError(error.message);
        }
    }

    // Function to task edit
    async function handleEditTask (id, newTitle, newDescription) {
        try {
            await editTask(id, newTitle, newDescription);
            await loadTasks();
        } catch (error) {
            setError(error);
        }
    }

    return {
        tasks, setTasks,
        error, setError,
        loading, setLoading,
        pagination, setPagination,
        currentPage, setCurrentPage,
        pageSize, setPageSize,
        search, setSearch,
        debouncedSearch, setDebouncedSearch,
        completedFilter, setCompletedFilter,
        sort, setSort,
        order, setOrder,
        handleAddTask, handleDeleteTask, handleToggleTaskCompletion, handleEditTask
    };
}

export default useTasks;