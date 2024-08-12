import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import { ArrowBack } from '@mui/icons-material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useDebounce from '@/hooks/useDebounce';
import { useCreateAdminNewFontMutation, useGetAdminAllFontsQuery, useGetAdminALLFontsCountQuery, useUpdateAdminFontMutation, useDeleteAdminFontMutation } from '@/slices/fontApiSlice';

const options = [
    { name: 'Active Fonts', isActive: true },
    { name: 'Inactive Fonts', isActive: false },
    { name: 'Create Fonts', isCreate: true }
];

const ITEM_HEIGHT = 48;
const PAGE_SIZE = 10; // Number of rows per page

export default function PaginatedTable() {
    const [isActive, setIsActive] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [isActiveFont, setIsActiveFont] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalCount, setTotalCount] = useState(0);
    const [selectedFont, setSelectedFont] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [fontData, setFontData] = useState({ name: '', family: '' });
    const [rows, setRows] = useState([]);

    // Debounced search query
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    // Fetch the data based on the debounced search query and filter
    const { data: allFontsData, isLoading: isAllFontsLoading, error: allFontsError, refetch: allFontDataRefetch } = useGetAdminAllFontsQuery({
        page,
        limit: pageSize,
        name: debouncedSearchQuery,
        is_active: isActiveFont
    });

    const [createFont, { isLoading: isCreateFontLoading, error: createFontError }] = useCreateAdminNewFontMutation();
    const [updateFont, { isLoading: isUpdateFontLoading, error: updateFontError }] = useUpdateAdminFontMutation();
    const [deleteFont, { isLoading: isDeleteFontLoading, error: deleteFontError }] = useDeleteAdminFontMutation();

    // Fetch total count of fonts for pagination
    const { data: allFontsCountData } = useGetAdminALLFontsCountQuery();

    useEffect(() => {
        if (allFontsCountData) {
            setTotalCount(allFontsCountData.totalFonts || 0);
        }
    }, [allFontsCountData]);

    useEffect(() => {
        // Reset the page when search query changes
        setPage(1);
    }, [searchQuery, isActiveFont]);

    useEffect(() => {
        if (allFontsData?.data) {
            // Create a new array to avoid mutating the original data
            const sortedRows = [...allFontsData.data].sort((a, b) => a.id - b.id);
            setRows(sortedRows);
        }
    }, [allFontsData, setIsActiveFont],);

    // Handle three dots menu
    const [openClose3DotsMenu, setOpenClose3DotsMenu] = useState(null);
    const open = Boolean(openClose3DotsMenu);

    const handleThreeDotsClick = (event) => {
        setOpenClose3DotsMenu(event.currentTarget);
    };

    const handleClose = (option) => {
        setOpenClose3DotsMenu(null);
        if (option.isActive !== undefined) {
            setIsActiveFont(option.isActive);
            setPage(1); // Reset page to 1 when filter changes
        }
        if (option.isCreate) {
            setOpenCreateModal(true); // Open the create font modal
        }
    };

    // Search Input Handler
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    useEffect(() => {
        const setActiveOrNot = isActive ? 1 : 2;
    }, [isActive])

    // Handle Edit Click
    const handleEdit = (row) => {
        const setActiveOrNot = isActive ? 1 : 2;
        setSelectedFont(row);
        setFontData({ name: row.name, family: row.family, status: setActiveOrNot });
        setOpenEditModal(true);
    };

    // Handle Delete Click
    const handleDelete = async (id) => {
        try {
            await deleteFont(id).unwrap();
            allFontDataRefetch();
        } catch (error) {
            console.log("Deleted Api Error ", error);
        }
    };

    const handleModalClose = () => {
        setOpenEditModal(false);
        setOpenCreateModal(false);
    };

    const handleSave = async () => {
        try {
            if (selectedFont) {
                // Update existing font
                const updatedFont = await updateFont({
                    id: selectedFont.id,
                    bodyData: fontData
                }).unwrap();

                // Update and sort the rows
                setRows(prevRows =>
                    [...prevRows.map(row => row.id === updatedFont.id ? updatedFont : row)].sort((a, b) => a.id - b.id)
                );

                allFontDataRefetch();
                handleModalClose();
            } else {
                // Create new font
                await createFont(fontData).unwrap();
                // Refetch to get the updated list
                allFontDataRefetch();
                handleModalClose();
            }
        } catch (error) {
            console.log('Failed to save font:', error);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', minWidth: 100, headerClassName: 'bg-[#22477F] text-slate-100 text-md md:text-lg' },
        { field: 'name', headerName: 'Font Name', flex: 1, minWidth: 200, headerClassName: 'bg-[#22477F] text-slate-100 font-bold text-md md:text-lg' },
        {
            field: 'update',
            headerName: 'Update Font',
            flex: 1, minWidth: 150,
            headerClassName: 'bg-[#22477F] text-slate-100 text-md md:text-lg',
            renderCell: (params) => (
                <IconButton
                    color="primary"
                    onClick={() => handleEdit(params.row)}
                >
                    <EditIcon />
                </IconButton>
            ),
        },
        {
            field: 'delete',
            headerName: 'Delete Font',
            flex: 1, minWidth: 150,
            headerClassName: 'bg-[#22477F] text-slate-100 text-md md:text-lg',
            renderCell: (params) => (
                <IconButton
                    color="error"
                    onClick={() => handleDelete(params.row.id)}
                >
                    <DeleteIcon />
                </IconButton>
            ),
        }
    ];

    return (
        <div className='w-screen min-h-screen flex flex-col justify-between'>
            <Box sx={{ width: "100%", height: "auto" }}>
                <Header />
                <div className='w-full md:w-[90%] lg:w-[70%] mx-auto mt-3'>
                    <Box sx={{ mb: "2rem" }}>
                        <Link href={'/admin-dashboard'} className='flex items-center justify-start gap-1'>
                            <ArrowBack color='primary' />
                            <Typography variant='h6' color={'primary'} className='text-sm sm:text-base md:text-lg'>
                                Admin Dashboard
                            </Typography>
                        </Link>
                    </Box>

                    <Box sx={{ width: "100%", height: "auto", display: "flex", alignItems: 'center', justifyContent: "space-between" }}>
                        <Typography variant='h5' color={'primary'} marginBottom={1}>
                            {isActiveFont ? 'Active Fonts' : 'Inactive Fonts'}
                        </Typography>
                        <div>
                            <IconButton
                                aria-label="more"
                                id="long-button"
                                aria-controls={open ? 'long-menu' : undefined}
                                aria-expanded={open ? 'true' : undefined}
                                aria-haspopup="true"
                                onClick={handleThreeDotsClick}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id="long-menu"
                                MenuListProps={{
                                    'aria-labelledby': 'long-button',
                                }}
                                anchorEl={openClose3DotsMenu}
                                open={Boolean(openClose3DotsMenu)}
                                onClose={() => setOpenClose3DotsMenu(null)}
                                PaperProps={{
                                    style: {
                                        maxHeight: ITEM_HEIGHT * 4.5,
                                        width: '20ch',
                                    },
                                }}
                            >
                                {options.map((option, index) => (
                                    <MenuItem key={index} selected={option.isActive === isActiveFont} onClick={() => handleClose(option)}>
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </div>
                    </Box>

                    <Box sx={{ width: '100%', height: "auto", mb: "1rem" }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search by Font Name"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </Box>

                    <Box sx={{ width: '100%', height: "450px", overflow: 'hidden' }}>
                        {isAllFontsLoading && <Typography variant='h5' color={"primary"}>Loading...</Typography>}
                        {allFontsError && <Typography variant="h5" color={"error"}>{allFontsError?.data?.message || 'Error loading fonts'}</Typography>}

                        <DataGrid
                            disableColumnFilter
                            disableColumnMenu
                            rows={rows}
                            columns={columns}
                            pageSize={pageSize}
                            rowsPerPageOptions={[PAGE_SIZE]}
                            pagination
                            paginationMode="server"
                            rowCount={totalCount} // Total number of rows for pagination calculations
                            paginationModel={{
                                page: page - 1,
                                pageSize,
                            }}
                            onPaginationModelChange={({ page, pageSize }) => {
                                setPage(page + 1);
                                setPageSize(pageSize);
                            }}
                        />
                    </Box>
                </div>
            </Box>
            <Footer />

            {/* Edit Font Modal */}
            <Dialog open={openEditModal} onClose={handleModalClose}>
                <DialogTitle>Edit Font</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Font Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={fontData.name}
                        onChange={(e) => setFontData({ ...fontData, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Font Family"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={fontData.family}
                        onChange={(e) => setFontData({ ...fontData, family: e.target.value })}
                    />
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", gap: "1rem" }}>
                        <input type="checkbox" name="activeOrNot" id="activeOrNot" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
                        <label htmlFor="activeOrNot">{isActive ? "Deactivate Font" : "Activate Font"} </label>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary" disabled={isUpdateFontLoading}>
                        {isUpdateFontLoading ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Create Font Modal */}
            <Dialog open={openCreateModal} onClose={handleModalClose}>
                <DialogTitle>Create Font</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Font Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={fontData.name}
                        onChange={(e) => setFontData({ ...fontData, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Font Family"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={fontData.family}
                        onChange={(e) => setFontData({ ...fontData, family: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary" disabled={isCreateFontLoading}>
                        {isCreateFontLoading ? 'Creating...' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
