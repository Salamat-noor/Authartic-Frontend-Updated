import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Dialog, DialogContent, DialogTitle, DialogActions } from "@mui/material";
import { toast } from 'react-toastify';
import PackageCard from "@/components/packageCards";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { useGetsubscrptionPlanQuery } from "@/slices/packageDataApiSlice";
import { useSelector } from "react-redux";
import { useRouter } from 'next/router'; // Import the useRouter hook
import { useResendVerificationEmailMutation } from "@/slices/userApiSlice";
import { WithAuth } from "@/components/withAuth";

const Index = () => {
  const [openModal, setOpenModal] = useState(false);
  const { userInfo } = useSelector((state) => state?.auth);
  const router = useRouter(); // Initialize the router

  const {
    data: subscriptionData,
    error: subscriptionError,
    isError: isSubscriptionError,
    isLoading: isSubscriptionLoading,
  } = useGetsubscrptionPlanQuery();

  const [resendVerificationEmail, { isLoading: resendLoading }] = useResendVerificationEmailMutation();

  useEffect(() => {
    if (userInfo) {
      const isEmailVerified = userInfo?.user?.is_email_verified;
      if (!isEmailVerified) {
        setOpenModal(true);
      } else {
        // Redirect to the package purchase page if the email is verified
        router.push('/package-plans');
      }
    }
  }, [userInfo, router]);

  const handleResendVerification = async () => {
    if (!userInfo?.user?.email) {
      toast.error("Unable to resend verification email. User email is missing.");
      return;
    }

    try {
      await resendVerificationEmail({ email: userInfo.user.email }).unwrap();
      toast.success("Verification email has been sent!");
    } catch (err) {
      if (err.data && err.data.message) {
        toast.error(`Failed to resend verification email: ${err.data.message}`);
      } else {
        toast.error("Failed to resend verification email. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative">
      <Header />

      {/* Full-screen overlay when email is not verified */}
      {openModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <DialogTitle>Email Verification Required</DialogTitle>
            <DialogContent>
              <Typography>
                Your email address is not verified yet. Please click the button below to resend the verification email.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleResendVerification}
                color="primary"
                disabled={resendLoading}
              >
                {resendLoading ? "Sending..." : "Resend Verification Email"}
              </Button>
            </DialogActions>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!openModal && (
        <Box className="min-h-screen">
          <Box className="max-w-[1440px] mx-auto bg-white relative">
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
      )}

      <Footer />
    </div>
  );
};

export default WithAuth(Index, ['VENDOR']);
