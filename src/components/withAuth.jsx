import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export const WithAuth = (WrappedComponent, rolesRequired = []) => {
  return (props) => {
    const router = useRouter();
    const userInfo = useSelector((state) => state.auth.userInfo);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hasRequiredRole, setHasRequiredRole] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [shouldRedirect, setShouldRedirect] = useState(false);

    useEffect(() => {
      if (userInfo?.access_token) {
        setIsLoggedIn(true);
        if (rolesRequired.length > 0) {
          setHasRequiredRole(rolesRequired.includes(userInfo?.user?.role));
        } else {
          setHasRequiredRole(true);
        }
      } else {
        setIsLoggedIn(false);
        setShouldRedirect(true);
      }
      setIsLoading(false);
    }, [userInfo]);

    useEffect(() => {
      if (!isLoading && !hasRequiredRole) {
        router.push("/unauthorized");
      }
    }, [isLoading, shouldRedirect, hasRequiredRole, router]);

    if (isLoading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }
    if (!isLoggedIn || !hasRequiredRole) {
      return null;
    }
    return <WrappedComponent {...props} />;
  };
};
