export function TaskFilters({
    search, completedFilter, order, sort,
    onSearchChange, onCompletedFilterChange, onOrderChange, onSortChange
}) {
    return (
        <div className="task-filters">
            <input className="form-control"
                type="search"
                placeholder="Search tasks..."
                aria-label="Search tasks"
                value={search} 
                onChange={(e) => {
                onSearchChange(e.target.value);
                }}/>

            <select className="form-control"
                aria-label="Filter tasks by completion"
                value={completedFilter}
                onChange={(e) => {
                onCompletedFilterChange(e.target.value);
                }}>
                <option value="">All tasks</option>
                <option value="true">Completed</option>
                <option value="false">Not completed</option>
            </select>

            <select className="form-control"
                aria-label="Sort tasks by"
                value={sort}
                onChange={(e) => {
                onSortChange(e.target.value);
                }}>
                <option value="title">Title</option>
                <option value="completed">Status</option>
            </select>

            <select className="form-control"
                aria-label="Sort order"
                value={order}
                onChange={(e) => {
                onOrderChange(e.target.value);
                }}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
        </div>
    );
}