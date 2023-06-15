import React, { useEffect } from "react";
import Header from "./Header";
import Authmodal from "./Authmodal";
import UploadModal from "./UploadModal";
import PostFormModal from "./PostFormModal";
import CommunityFormModal from "./CommunityFormModal";
import { BrowserRouter as Router, Navigate } from "react-router-dom";
import Routinglocation from "./Routinglocation";
import { useContext } from "react";
import RedirectContext from "../context/RedirectContext";
import RerenderContext from "../context/RerenderContext";

const Routing = () => {
  const { redirect, setRedirect } = useContext(RedirectContext);
  const { errorPage, setErrorPage } = useContext(RerenderContext);

  useEffect(() => {
    if (errorPage) {
      setErrorPage(false);
    }
  }, [errorPage]);

  useEffect(() => {
    if (redirect) {
      setRedirect(false);
    }
  }, [redirect]);
  return (
    <Router>
      {!!errorPage && <Navigate to={errorPage} />}

      {!!redirect && <Navigate to={redirect} />}

      {!redirect && (
        <>
          <Header />
          <UploadModal />
          <Routinglocation />
          <Authmodal />
          <CommunityFormModal />
          <PostFormModal />
        </>
      )}
    </Router>
  );
};

export default Routing;
