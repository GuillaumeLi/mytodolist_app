export function TaskFilters({
    search, completedFilter, order, sort,
    onSearchChange, onCompletedFilterChange, onOrderChange, onSortChange
}) {
    return (
        <>
            <input value={search} 
                onChange={(e) => {
                onSearchChange(e.target.value);
                }}>
            </input>

            <select value={completedFilter}
                onChange={(e) => {
                onCompletedFilterChange(e.target.value);
                }}>
                <option value="">All tasks</option>
                <option value="true">Completed</option>
                <option value="false">Not completed</option>
            </select>

            <select value={sort}
                onChange={(e) => {
                onSortChange(e.target.value);
                }}>
                <option value="title">Title</option>
                <option value="completed">Status</option>
            </select>

            <select value={order}
                onChange={(e) => {
                onOrderChange(e.target.value);
                }}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
        </>
    );
}