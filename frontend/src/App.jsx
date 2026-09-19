import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { TaskFilters } from './components/TaskFilters';
import { Pagination } from './components/Pagination';
import { useTasks } from './hooks/useTasks';

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
      <h1>My To-Do List</h1>

      <TaskFilters search={search} completedFilter={completedFilter} order={order} sort={sort} 
      onSearchChange={handleSearchChange} onCompletedFilterChange={handleCompletedFilterChange}
      onSortChange={handleSortChange} onOrderChange={handleOrderChange}
      />

      <TaskForm onSubmit={handleAddTask}/>

      <div className="loading-container">
        {loading && <p role="status">Loading...</p>}
        {error && <p role="alert">{error}</p>}
        {!error && !loading && tasks.length === 0 && <p>No tasks found</p>}
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