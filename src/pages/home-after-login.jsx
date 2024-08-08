import React, { useEffect, useState } from "react";
import CustomButton from "@/components/muiButton";
import { Box } from "@mui/material";
import SampleCard from "@/components/certificateCards";
import Header from "@/components/header";
import { Button } from "@mui/material";
import Footer from "@/components/footer";
import { useGetMyCertificateInfoQuery } from "@/slices/certificateInfoApiSlice";
import { useGetProfileQuery } from "@/slices/userApiSlice";

const index = () => {
  const [drafttext, setDraftText] = useState("Drafts")
  const [certificateData, setCertificateData] = useState([]);
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    saved_draft: false
  })
  const {
    data: allCertificateData,
    error,
    isLoading,
    refetch
  } = useGetMyCertificateInfoQuery(params);


  const handleDraftCertificates = () => {

    if (drafttext === "Drafts") {
      setDraftText("Issued Certificates")
      refetch();
      setParams({
        page: 1,
        limit: 10,
        saved_draft: true
      })
    } else {
      setDraftText("Drafts")
      refetch();
      setParams({
        page: 1,
        limit: 10,
        saved_draft: false
      })
    }
  }

  useEffect(() => {
    refetch(); // Call refetch independently if needed
  }, [refetch]); // Dependency on refetch alone

  useEffect(() => {
    if (!error) {
      if (allCertificateData) {
        setCertificateData(allCertificateData);
      } else {
        setCertificateData([]);
      }
    } else {
      setCertificateData([]); // Or handle error state here
    }
  }, [allCertificateData]); // Omit refetch if it causes issues

  useEffect(() => {
    if (!error && allCertificateData !== certificateData) {
      setCertificateData(allCertificateData);
    } else if (error) {
      setCertificateData([]); // Handle error case
    }
  }, [allCertificateData, certificateData]); // Add certificateData to avoid unnecessary updates


  return (
    <>
      <Box className="min-h-screen flex flex-col justify-between">
        <Box className={`w-full`}>
          <Header />
          <Box className="w-full max-w-[962px]  relative mx-auto mt-1">
            <Box className="flex flex-col items-center w-full">
              <Box className="flex flex-col items-end gap-1">

                <CustomButton title={"New order"} />
                <Button className={`bg-white text-black hover:bg-white`} onClick={() => handleDraftCertificates(true)}>
                  {drafttext}
                </Button>
              </Box>
            </Box>
            <div className="w-full my-8 flex flex-col justify-start items-center gap-[70px]">
              {isLoading && (
                <h1 className="text-green-700 font-bold text-xl">Loading...</h1>
              )}
              {!error && certificateData?.data?.map((data, index) => (
                <SampleCard data={data} key={index} />
              ))}
              {error && (
                <h1 className="text-red-700 font-bold text-xl">
                  {error?.data?.message}
                </h1>
              )}
              {certificateData?.total === 0 && (
                <h1 className="text-red-700 font-bold text-xl">
                  No Certificates Available
                </h1>
              )}
            </div>
          </Box>
        </Box>
        <Footer />
      </Box>
    </>
  );
};
export default index;
