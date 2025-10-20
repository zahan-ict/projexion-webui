import {
    Box,
    Pagination,
    PaginationItem,
    Typography,
    FormControl,
    Select,
    MenuItem

} from "@mui/material";
import {
    useGridApiContext,
    useGridSelector,
    gridPageSelector,
    gridPageSizeSelector,
    gridRowCountSelector,
} from "@mui/x-data-grid";

function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageSize = useGridSelector(apiRef, gridPageSizeSelector);
    const rowCount = useGridSelector(apiRef, gridRowCountSelector);
    const totalPages = Math.max(1, Math.ceil((rowCount || 0) / (pageSize || 1)));
    const start = rowCount === 0 ? 0 : page * pageSize + 1;
    const end = Math.min(rowCount, (page + 1) * pageSize);

    const handlePageSizeChange = (event) => {
        const newSize = parseInt(event.target.value, 10);
        apiRef.current.setPageSize(newSize);
    };

    return (
        <div style={{ width: '100%' }}>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                gap={2}
                padding={1}
            >
                {/* Range Info on Left */}
                <Box>
                    <Typography sx={{ color: "GrayText", ml: 1 }}> Show {`${start}–${end} of ${rowCount}`} results</Typography>
                </Box>

                {/* Centered Pagination */}
                <Box display="flex" justifyContent="center" flexGrow={1}>
                    <Pagination
                        color="primary"
                        showFirstButton
                        showLastButton
                        page={page + 1} // DataGrid is 0-based
                        count={totalPages}
                        onChange={(event, value) => apiRef.current.setPage(value - 1)}
                        renderItem={(item) => (
                            <PaginationItem
                                {...item}
                                slots={{ previous: () => <>Previous</>, next: () => <>Next</> }}
                            />
                        )}
                    />
                </Box>

                {/* Rows per page */}
                <Box display="flex" alignItems="center" gap={1}>
                    <Typography sx={{ color: "GrayText", }}>Items per page:</Typography>
                    <FormControl
                        size="small"
                        sx={{
                           
                            padding: 0,          // remove default padding
                            marginRight: 1,           // remove default margin
                            '& .MuiSelect-select': {
                                paddingY: 0.30,    // vertical padding inside select
                                paddingX: 0.8,     // horizontal padding inside select
                                fontSize: '0.90rem',
                            },
                            '& .MuiInputBase-root': {
                                height: 32,        // reduce total height
                            },
                        }}
                    >
                        <Select value={pageSize} onChange={handlePageSizeChange}>
                            {[20, 50, 100].map((size) => (
                                <MenuItem key={size} value={size}>
                                    {size}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>
        </div>
    );
}

export default CustomPagination;

