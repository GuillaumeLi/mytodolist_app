export function Pagination({
    pageSize, setPageSize,
    currentPage, setCurrentPage,
    pagination
}){
    return (
        <>
            {pagination && pagination.totalPages > 1 && (
                <div>
                    <label>
                        Tasks per page : 
                        <select value={pageSize} 
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);}}>
                        <option value="2">2</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        </select>
                    </label>

                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(prevPage => prevPage - 1)}>
                        Previous
                    </button>

                    <span>Page {currentPage} of {pagination.totalPages}</span>

                    <button disabled={currentPage >= pagination.totalPages} onClick={() => setCurrentPage(prevPage => prevPage + 1)}>
                        Next
                    </button>
                </div>
            )}
        </>
    );
}