import { useState, useEffect, useCallback } from "react";

import { getTasks, addTask, deleteTask, toggleTaskCompletion, editTask } from "../services/tasksApi";

const SEARCH_DEBOUNCE_DELAY = 300;

export function useTasks () {
    const [tasks, setTasks] = useState([]);
    
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(2);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [completedFilter, setCompletedFilter] = useState("");
    const [sort, setSort] = useState("title");
    const [order, setOrder] = useState("asc");

    const loadTasks = useCallback(async () => {
        setError(null);
        setLoading(true);
        try {
            const data = await getTasks({currentPage, pageSize, search: debouncedSearch, completedFilter, sort, order});
            setTasks(data.tasks);
            setPagination(data.pagination);
            
            if (data.pagination.totalPages === 0) {
                setCurrentPage(1);
            } else if (currentPage > data.pagination.totalPages) {
                // The current page no longer exists after a deletion
                setCurrentPage(data.pagination.totalPages);
            }
            
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, debouncedSearch, completedFilter, sort, order]);
    
    useEffect(() => {
        loadTasks();
    }, [loadTasks]);
    
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1);
        }, SEARCH_DEBOUNCE_DELAY);

        return () => {
            clearTimeout(debounceTimer);
        };
    }, [search]);

    async function handleAddTask (title, description) {
        await addTask(title, description);
        await loadTasks();
    }

    async function handleDeleteTask(id) {
        await deleteTask(id);
        await loadTasks();
    }

    async function handleToggleTaskCompletion(id, completed) {
        await toggleTaskCompletion(id, completed);
        await loadTasks();
    }

    async function handleEditTask(id, newTitle, newDescription) {
        await editTask(id, newTitle, newDescription);
        await loadTasks();
    }

    function handleNextPage() {
        setCurrentPage((prevPage) => prevPage + 1);
    }

    function handlePreviousPage() {
        setCurrentPage((prevPage) => prevPage - 1);
    }

    function handlePageSizeChange(newPageSize) {
        setPageSize(newPageSize);
        // A page size change can make the current page invalid, so we always return to page 1
        setCurrentPage(1);
    }

    function handleSearchChange(newSearch) {
        setSearch(newSearch);
    }

    function handleCompletedFilterChange(completedFilterValue) {
        setCompletedFilter(completedFilterValue);
        setCurrentPage(1);
    }

    function handleSortChange(sortValue) {
        setSort(sortValue);
        setCurrentPage(1);
    }

    function handleOrderChange(orderValue) {
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