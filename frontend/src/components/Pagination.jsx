const PAGE_SIZE_OPTIONS = [2, 5, 10, 20];

export function Pagination({
    pageSize, currentPage, pagination,
    onNextPage, onPreviousPage, onPageSizeChange
}){
    return (
        <nav aria-label="Pagination">
            <label htmlFor="page-size">
                Tasks per page : 
            </label>
            
            <select id="page-size"
            value={pageSize} 
            onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
            }}>
                {PAGE_SIZE_OPTIONS.map(size => (
                    <option key={size} value={size}>{size}</option>
                ))}
            </select>
            
            {pagination.totalPages > 1 && (
                <>
                    <button type="button" disabled={currentPage === 1} onClick={onPreviousPage}>
                        Previous
                    </button>

                    <span>Page {currentPage} of {pagination.totalPages}</span>

                    <button type="button" disabled={currentPage >= pagination.totalPages} onClick={onNextPage}>
                        Next
                    </button>
                </>
            )}
        </nav>
    );
}