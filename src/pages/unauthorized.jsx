import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { LockOutlined, ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/router';
const UnauthorizedPage = () => {
    const router = useRouter();
    const handleBack = () => {
        router.push('/'); // Navigate to home page
    };
    return (
        <Box
            className="flex flex-col justify-center items-center min-h-screen bg-gray-100"
            sx={{ textAlign: 'center', p: 3 }}
        >
            <IconButton
                onClick={handleBack}
                sx={{ position: 'absolute', top: 20, left: 20 }}
            >
                <ArrowBack />
            </IconButton>
            <LockOutlined
                sx={{ fontSize: 60, color: 'error.main' }}
                className="mb-4"
            />
            <Typography variant="h4" component="h1" className="mb-2">
                Unauthorized Access
            </Typography>
            <Typography variant="body1" color="textSecondary">
                You do not have permission to view this page.
            </Typography>
        </Box>
    );
};
export default UnauthorizedPage;