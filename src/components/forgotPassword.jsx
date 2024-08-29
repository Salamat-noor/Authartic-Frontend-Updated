import React, { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify'; // Ensure you have react-toastify installed

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Replace this with your API call
      // Example:
      // await fetch('/api/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
      
      // Simulating API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success('Password reset link sent! Please check your email.');
      router.push('/login'); // Redirect to login page after successful submission
    } catch (error) {
      toast.error('Failed to send reset link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Box className="max-w-sm w-full bg-white p-6 rounded-lg shadow-lg">
        <Typography variant="h5" component="h1" className="text-center mb-4">
          Forgot Password
        </Typography>
        <Typography variant="body1" className="text-center mb-4">
          Enter your email address below and we'll send you a link to reset your password.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Send Reset Link'}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
