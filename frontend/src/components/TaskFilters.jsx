export function TaskFilters({
    search, setSearch,
    completedFilter, setCompletedFilter,
    sort, setSort,
    order, setOrder,
    setCurrentPage,
}) {
    return (
        <>
            <input value={search} 
                onChange={(e) => {
                setSearch(e.target.value);}}>
            </input>

            <select value={completedFilter}
                onChange={(e) => {
                setCompletedFilter(e.target.value);
                setCurrentPage(1);
                }}>
                <option value="">All tasks</option>
                <option value="true">Completed</option>
                <option value="false">Not completed</option>
            </select>

            <select value={sort}
                onChange={(e) => {
                setSort(e.target.value);
                setCurrentPage(1);
                }}>
                <option value="title">Title</option>
                <option value="completed">Status</option>
            </select>

            <select value={order}
                onChange={(e) => {
                setOrder(e.target.value);
                setCurrentPage(1);
                }}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
        </>
    );
}