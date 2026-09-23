import { TaskForm } from './features/tasks/components/TaskForm/TaskForm';
import { TaskList } from './features/tasks/components/TaskList/TaskList';
import { TaskFilters } from './features/tasks/components/TaskFilters/TaskFilters';
import { Pagination } from './components/ui/Pagination/Pagination';
import { useTasks } from './features/tasks/hooks/useTasks';

import './App.css';

function App() {

  const {
    tasks, error, loading, pagination,
    currentPage, pageSize,
    search, completedFilter, sort, order,
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

        <TaskForm onSubmit={handleAddTask}/>
      </div>

      <div className="loading-container">
        {loading && <p role="status">Loading...</p>}
        {error && <p role="alert">{error}</p>}
        {!error && !loading && tasks.length === 0 && <p className="empty-tasks-message">No tasks found</p>}
      </div>

      <TaskList 
        tasks={tasks} 
        onDeleteTask={handleDeleteTask} 
        onToggleTaskCompletion={handleToggleTaskCompletion} 
        onEditTask={handleEditTask}
      />

      <Pagination pageSize={pageSize} pagination={pagination} currentPage={currentPage} 
        onNextPage={handleNextPage} onPreviousPage={handlePreviousPage} onPageSizeChange={handlePageSizeChange}
      />

    </main>
  );
}

export default App;