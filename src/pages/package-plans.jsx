import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import PackageCard from "@/components/packageCards";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { useGetsubscrptionPlanQuery } from "@/slices/packageDataApiSlice";
import { useSelector } from "react-redux";

const index = () => {
  const [isUserValidated, setIsUserValidated] = useState(null);
  const { userInfo } = useSelector(state => state?.auth)

  const {
    data: subcriptionData,
    error,
    isError,
    isLoading,
  } = useGetsubscrptionPlanQuery();

  useEffect(() => {
    if (userInfo) {
      setIsUserValidated(!userInfo?.user?.validation_code)
    }
  }, [userInfo])


  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <Box className="min-h-screen">
        <Box className=" max-w-[1440px] mx-auto bg-white relative">
          {isUserValidated && <Typography variant="h5" color={'error'} className="text-center mt-12">You will not be charged until after we validate your account.<br></br> You will receive an email notification.</Typography>}

          <Box className="w-full min-h-[100vh] flex items-center  justify-center pt-[7%] md:pt-0  pb-[150px]">
            {isLoading && (
              <h1 className="font-KoHo font-bold text-blue-600 text-[14px] sm:text-[18px] md:text-[24px]">
                Loading! Please wait...
              </h1>
            )}

            {subcriptionData && (
              <Box className="grid items-end justify-items-center gap-7 md:gap-1 lg:gap-7 grid-cols-1 md:grid-cols-3 px-2">
                {subcriptionData.map((data) => (
                  <PackageCard data={data} key={data.id} />
                ))}
              </Box>
            )}
            {isError && (
              <h1 className="font-KoHo font-bold text-red-600 text-[14px] sm:text-[18px] md:text-[24px]">
                {error?.error}
              </h1>
            )}
          </Box>
        </Box>
      </Box>

      <Footer />
    </div>
  );
};

export default index;