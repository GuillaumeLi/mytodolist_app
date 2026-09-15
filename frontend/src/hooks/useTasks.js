import { useState, useEffect } from "react";

import { getTasks, addTask, deleteTask, toggleTaskCompletion, editTask } from "../services/tasksApi";

export function useTasks () {
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
                // The current page no longer exists after a deletion
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

    async function handleAddTask (title, description) {
        try {
            await addTask(title, description);
            await loadTasks();
        } catch (error) {
            setError(error.message);
        }
    }

    async function handleDeleteTask (id) {
        try {
            await deleteTask(id);
            await loadTasks();
        } catch (error) {
            setError(error.message);
        }
    }

    async function handleToggleTaskCompletion(id, completed) {
        try {
            await toggleTaskCompletion(id, completed);
            await loadTasks();
        } catch (error) {
            setError(error.message);
        }
    }

    async function handleEditTask (id, newTitle, newDescription) {
        try {
            await editTask(id, newTitle, newDescription);
            await loadTasks();
        } catch (error) {
            setError(error);
        }
    }

    function handleNextPage () {
        setCurrentPage((prevPage) => prevPage + 1);
    }

    function handlePreviousPage () {
        setCurrentPage((prevPage) => prevPage - 1);
    }

    function handlePageSizeChange (newPageSize) {
        setPageSize(newPageSize);
        // A page size change can make the current page invalid, so we always return to page 1
        setCurrentPage(1);
    }

    function handleSearchChange (newSearch) {
        setSearch(newSearch);
    }

    function handleCompletedFilterChange (completedFilterValue) {
        setCompletedFilter(completedFilterValue);
        setCurrentPage(1);
    }

    function handleSortChange (sortValue) {
        setSort(sortValue);
        setCurrentPage(1);
    }

    function handleOrderChange (orderValue) {
        setOrder(orderValue);
        setCurrentPage(1);
    }

    return {
        tasks, error, loading, pagination,
        currentPage, pageSize,
        search, completedFilter, sort, order,
        handleAddTask, handleDeleteTask, handleToggleTaskCompletion, handleEditTask,
        handleNextPage, handlePreviousPage, handlePageSizeChange,
        handleSearchChange, handleCompletedFilterChange, handleSortChange, handleOrderChange
    };
}