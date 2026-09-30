import { TaskForm } from './features/tasks/components/TaskForm/TaskForm';
import { TaskList } from './features/tasks/components/TaskList/TaskList';
import { TaskFilters } from './features/tasks/components/TaskFilters/TaskFilters';
import { Pagination } from './components/ui/Pagination/Pagination';
import { useTasks } from './features/tasks/hooks/useTasks';

import './App.css';

function App() {

  const {
    tasks, error, isFetchingTasks, pagination,
    currentPage, pageSize,
    search, completedFilter, sort, order,
    isPlaceholderData,
    isAddingTask, isDeletingTask, togglingTaskId, isEditingTask,
    handleAddTask, handleDeleteTask, handleToggleTaskCompletion, handleEditTask,
    handleNextPage, handlePreviousPage, handlePageSizeChange,
    handleSearchChange, handleCompletedFilterChange, handleSortChange, handleOrderChange
  } = useTasks();

  return (
    <main className="app">

      <header  className="app-header">
        <h1>My To-Do List</h1>
      </header>

      <div className="task-toolbar">
        <TaskFilters search={search} completedFilter={completedFilter} order={order} sort={sort} 
        onSearchChange={handleSearchChange} onCompletedFilterChange={handleCompletedFilterChange}
        onSortChange={handleSortChange} onOrderChange={handleOrderChange}
        />

        <TaskForm onSubmit={handleAddTask} isPending={isAddingTask}/>
      </div>

      <div className="loading-container">
        {isFetchingTasks && <p role="status">Loading...</p>}
        {error && <p role="alert">{error}</p>}
        {!error && !isFetchingTasks && tasks.length === 0 && <p className="empty-tasks-message">No tasks found</p>}
      </div>

      <TaskList 
        tasks={tasks} 
        onDeleteTask={handleDeleteTask} 
        onToggleTaskCompletion={handleToggleTaskCompletion} 
        onEditTask={handleEditTask}
        isDeletingTask={isDeletingTask}
        isEditingTask={isEditingTask}
        togglingTaskId={togglingTaskId}
      />

      <Pagination pageSize={pageSize} pagination={pagination} currentPage={currentPage} 
        onNextPage={handleNextPage} onPreviousPage={handlePreviousPage} onPageSizeChange={handlePageSizeChange}
        isPlaceholderData={isPlaceholderData}
      />

    </main>
  );
}

export default App;