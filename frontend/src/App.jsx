import { TaskForm } from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilters from './components/TaskFilters';
import Pagination from './components/Pagination';
import useTasks from './hooks/useTasks';

function App() {

  const {
    tasks, error, loading, pagination,
    currentPage, setCurrentPage,
    pageSize, setPageSize,
    search, setSearch,
    completedFilter, setCompletedFilter,
    sort, setSort,
    order, setOrder,
    handleAddTask, handleDeleteTask, handleToggleTaskCompletion, handleEditTask
  } = useTasks();

  return (
    <div>
      <h1>My To-Do List</h1>

      <TaskFilters search={search} setSearch={setSearch}
        completedFilter={completedFilter} setCompletedFilter={setCompletedFilter}
        sort={sort} setSort={setSort}
        order={order} setOrder={setOrder}
        setCurrentPage={setCurrentPage}>
      </TaskFilters>      

      <br></br>

      <TaskForm onSubmit={handleAddTask}></TaskForm>

      <div className="loading-container">
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!error && !loading && tasks.length === 0 && <p>No tasks found</p>}
      </div>

      <TaskList 
        tasks={tasks} 
        onDeleteTask={handleDeleteTask} 
        onToggleTaskCompletion={handleToggleTaskCompletion} 
        onEditTask={handleEditTask}>
      </TaskList>

      <Pagination pageSize={pageSize} setPageSize={setPageSize}
        currentPage={currentPage} setCurrentPage={setCurrentPage}
        pagination={pagination}>
      </Pagination>

    </div>
  );
}

export default App;