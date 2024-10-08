import { Sidebar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HiArrowSmRight,
  HiUser,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiOutlineChartPie,
} from "react-icons/hi";
import { useDispatch } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";
import { useSelector } from "react-redux";

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  // sign out the user
  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/v1/user/signOut", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
  <Sidebar className="w-full md:w-56">
      <Sidebar.ItemGroup>
        {currentUser.isAdmin && (
          <Link to={"/dashboard?tab=dash"}>
            <Sidebar.Item
              active={tab === "dash"}
              icon={HiOutlineChartPie}
              labelColor="dark"
              as="div"
            >
              Dashboard
            </Sidebar.Item>
          </Link>
        )}
        <Link to={"/dashboard?tab=profile"}>
          <Sidebar.Item
            active={tab === "profile"}
            icon={HiUser}
            label={currentUser.isAdmin ? "Admin" : "User"}
            labelColor="dark"
            as="div"
          >
            Profile
          </Sidebar.Item>
        </Link>
        {currentUser.isAdmin && (
          <Link to={"/dashboard?tab=posts"}>
            <Sidebar.Item
              active={tab === "posts"}
              icon={HiDocumentText}
              as="div"
            >
              Posts
            </Sidebar.Item>
          </Link>
        )}

        {currentUser.isAdmin && (
          <>
            <Link to={"/dashboard?tab=users"}>
              <Sidebar.Item
                active={tab === "users"}
                icon={HiOutlineUserGroup}
                as="div"
              >
                Users
              </Sidebar.Item>
            </Link>

            <Link to={"/dashboard?tab=comments"}>
              <Sidebar.Item
                active={tab === "comments"}
                icon={HiAnnotation}
                as="div"
              >
                Comments
              </Sidebar.Item>
            </Link>
          </>
        )}

        <Sidebar.Item
          onClick={handleSignOut}
          icon={HiArrowSmRight}
          className="cursor-pointer"
        >
          Sign out
        </Sidebar.Item>
      </Sidebar.ItemGroup>
    </Sidebar>
  );
}
