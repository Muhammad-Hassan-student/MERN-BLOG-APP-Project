import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashhPost from "../components/DashhPost";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashComp from "../components/DashComp";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
  <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/*Side bar*/}
        <DashSidebar />
      </div>
      {/* profile */}
      {tab === "profile" && <DashProfile />}

      {/* Post */}

      {tab === "posts" && <DashhPost />}

      {/*Users*/}
      {tab === "users" && <DashUsers />}

      {/*Comments*/}
      {tab === "comments" && <DashComments />}

      {/*Dash*/}
      {tab === "dash" && <DashComp />}
    </div>
  );
}
