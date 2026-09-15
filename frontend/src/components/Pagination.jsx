export function Pagination({
    pageSize, currentPage, pagination,
    onNextPage, onPreviousPage, onPageSizeChange
}){
    return (
        <>
            {pagination && pagination.totalPages > 1 && (
                <div>
                    <label>
                        Tasks per page : 
                        <select value={pageSize} 
                        onChange={(e) => {
                            onPageSizeChange(Number(e.target.value));
                        }}>
                        <option value="2">2</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        </select>
                    </label>

                    <button disabled={currentPage === 1} onClick={onPreviousPage}>
                        Previous
                    </button>

                    <span>Page {currentPage} of {pagination.totalPages}</span>

                    <button disabled={currentPage >= pagination.totalPages} onClick={onNextPage}>
                        Next
                    </button>
                </div>
            )}
        </>
    );
}