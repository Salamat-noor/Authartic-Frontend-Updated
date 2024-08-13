import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Dialog, DialogContent, DialogTitle, DialogActions } from "@mui/material";
import { toast } from 'react-toastify';
import PackageCard from "@/components/packageCards";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { useGetsubscrptionPlanQuery } from "@/slices/packageDataApiSlice";
import { useSelector } from "react-redux";
import { WithAuth } from "@/components/withAuth";
import { useResendVerificationEmailMutation, useActivateEmailQuery } from "@/slices/userApiSlice";

const Index = () => {
  const [isUserValidated, setIsUserValidated] = useState(null);
  const [isEmailNotVerified, setIsEmailNotVerified] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { userInfo } = useSelector((state) => state?.auth);

  // Extract token from URL and query for email activation
  const token = new URLSearchParams(window.location.search).get('token');
  const { data: activationData, error: activationError, isError: isActivationError } = useActivateEmailQuery(token, {
    skip: !token,
  });

  const {
    data: subscriptionData,
    error: subscriptionError,
    isError: isSubscriptionError,
    isLoading: isSubscriptionLoading,
  } = useGetsubscrptionPlanQuery();

  // Mutation hook for resending verification email
  const [resendVerificationEmail, { isLoading: resendLoading, isError: resendError, error: resendErrorDetails },] = useResendVerificationEmailMutation();

  useEffect(() => {
    if (userInfo) {
      setIsUserValidated(!userInfo?.user?.validation_code);
      setIsEmailNotVerified(!userInfo?.user?.is_email_verified);
      if (!userInfo?.user?.is_email_verified) {
        setOpenModal(true);
      }
    }
  }, [userInfo]);

  useEffect(() => {
    if (activationData) {
      setOpenModal(false); // Close the modal if activation is successful
      toast.success("Your email has been successfully activated."); // Show success toast
    }
    if (isActivationError) {
      toast.error("Email activation failed. Please try again."); // Show error toast
    }
  }, [activationData, isActivationError]);

  const handleResendVerification = async () => {
    if (!userInfo?.user?.email) {
      toast.error("Unable to resend verification email. User email is missing.");
      return;
    }

  

    try {
      const response = await resendVerificationEmail({ email: userInfo.user.email }).unwrap();

      toast.success("Verification email has been sent!"); // Show success toast
      setOpenModal(false); // Close the modal after success
    } catch (err) {
      if (err.data && err.data.message) {
        toast.error(`Failed to resend verification email: ${err.data.message}`); // Show detailed error message
      } else {
        toast.error("Failed to resend verification email. Please try again."); // General error message
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <Box className="min-h-screen">
        <Box className="max-w-[1440px] mx-auto bg-white relative">
          {isUserValidated && (
            <Typography variant="h5" color={'error'} className="text-center mt-12">
              You will not be charged until after we validate your account.<br />
              You will receive an email notification.
            </Typography>
          )}

          <Box className="w-full min-h-[100vh] flex items-center justify-center pt-[7%] md:pt-0 pb-[150px]">
            {isSubscriptionLoading && (
              <h1 className="font-KoHo font-bold text-blue-600 text-[14px] sm:text-[18px] md:text-[24px]">
                Loading! Please wait...
              </h1>
            )}

            {subscriptionData && (
              <Box className="grid items-end justify-items-center gap-7 md:gap-1 lg:gap-7 grid-cols-1 md:grid-cols-3 px-2">
                {subscriptionData.map((data) => (
                  <PackageCard data={data} key={data.id} />
                ))}
              </Box>
            )}
            {isSubscriptionError && (
              <h1 className="font-KoHo font-bold text-red-600 text-[14px] sm:text-[18px] md:text-[24px]">
                {subscriptionError?.error}
              </h1>
            )}
          </Box>
        </Box>
      </Box>

      <Footer />

      {/* Modal for email verification */}
      <Dialog
        open={openModal}
        onClose={() => {}}
        aria-labelledby="email-verification-dialog"
        aria-describedby="email-verification-dialog-description"
      >
        <DialogTitle id="email-verification-dialog">Email Verification Required</DialogTitle>
        <DialogContent>
          <Typography id="email-verification-dialog-description">
            Please verify your email address to proceed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResendVerification} color="primary" disabled={resendLoading}>
            {resendLoading ? "Sending..." : "Resend Verification Email"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// export default Index;
export default WithAuth(Index, ['VENDOR']);
