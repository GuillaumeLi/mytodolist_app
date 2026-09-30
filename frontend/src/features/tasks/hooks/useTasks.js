import { useState, useEffect } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getTasks, addTask, deleteTask, toggleTaskCompletion, editTask } from "../services/tasksApi";

const SEARCH_DEBOUNCE_DELAY = 300;

export function useTasks () {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(2);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [completedFilter, setCompletedFilter] = useState("");
    const [sort, setSort] = useState("title");
    const [order, setOrder] = useState("asc");

    const [togglingTaskId, setTogglingTaskId] = useState(null);

    const queryClient = useQueryClient();
    const taskQueryParams = { currentPage, pageSize, search: debouncedSearch, completedFilter, sort, order };

    const tasksQuery = useQuery({
        queryKey: ["tasks", taskQueryParams],
        queryFn: ({ signal }) => getTasks({ ...taskQueryParams, signal }),
        placeholderData: keepPreviousData,
        staleTime: 30_000
    });

    const tasks = tasksQuery.data?.tasks ?? [];
    const pagination = tasksQuery.data?.pagination ?? null;
    const isFetchingTasks = tasksQuery.isFetching;
    const error = tasksQuery.error?.message ?? null;

    const invalidateTasks = () => queryClient.invalidateQueries({ queryKey: ["tasks"] });

    const addTaskMutation = useMutation({
        mutationFn: ({ title, description }) => addTask(title, description),
        onSuccess: invalidateTasks
    });

    const deleteTaskMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: invalidateTasks
    });

    const toggleTaskCompletionMutation = useMutation({
        mutationFn: ({ id, completed }) => toggleTaskCompletion(id, completed),
        onMutate: ({ id }) => { setTogglingTaskId(id); },
        onSuccess: invalidateTasks,
        onSettled: () => { setTogglingTaskId(null); }
    });

    const editTaskMutation = useMutation({
        mutationFn: ({ id, newTitle, newDescription }) => editTask(id, newTitle, newDescription),
        onSuccess: invalidateTasks
    });

    // Avoid incoherent current page value when deleting task
    useEffect(() => {
        const totalPages = tasksQuery.data?.pagination.totalPages;

        if (totalPages === undefined) {
            return;
        }

        if (totalPages === 0) {
            setCurrentPage(1);
        } else if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [tasksQuery.data, currentPage]);
    
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1);
        }, SEARCH_DEBOUNCE_DELAY);

        return () => {
            clearTimeout(debounceTimer);
        };
    }, [search]);

    function handleAddTask (title, description) {
        return addTaskMutation.mutateAsync({ title, description });
    }

    function handleDeleteTask(id) {
        return deleteTaskMutation.mutateAsync(id);
    }

    function handleToggleTaskCompletion(id, completed) {
        return toggleTaskCompletionMutation.mutateAsync({ id, completed });
    }

    function handleEditTask(id, newTitle, newDescription) {
        return editTaskMutation.mutateAsync({ id, newTitle, newDescription });
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
        tasks, error, isFetchingTasks, pagination,
        currentPage, pageSize,
        search, completedFilter, sort, order,
        isPlaceholderData: tasksQuery.isPlaceholderData,
        isAddingTask: addTaskMutation.isPending, isDeletingTask: deleteTaskMutation.isPending,
        togglingTaskId, isEditingTask: editTaskMutation.isPending,
        handleAddTask, handleDeleteTask, handleToggleTaskCompletion, handleEditTask,
        handleNextPage, handlePreviousPage, handlePageSizeChange,
        handleSearchChange, handleCompletedFilterChange, handleSortChange, handleOrderChange
    };
}