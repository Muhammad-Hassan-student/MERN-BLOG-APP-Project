import { Sidebar } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {HiArrowSmRight, HiUser} from 'react-icons/hi'
import { useDispatch } from 'react-redux';
import { signOutSuccess } from '../redux/user/userSlice';

export default function DashSidebar() {
    const location = useLocation();
    const [tab,setTab] = useState('');
    const dispatch=useDispatch();

    useEffect(() => {
      const urlParams= new URLSearchParams(location.search);
      const tabFromUrl= urlParams.get('tab');
      if(tabFromUrl){
        setTab(tabFromUrl);
      }
    } ,[location.search]);

      // sign out the user
      const handleSignOut=async () => {
        try {
          const res = await fetch('/api/v1/user/signOut',{
            method: 'POST',
          });
          const data=await res.json();
          if(!res.ok){
            console.log(data.message);
          }else{
           dispatch(signOutSuccess());
          }
        } catch (error) {
          console.log(error.message);
        }
      }
  

    return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.ItemGroup>
            <Link to={'/dashboard?tab=profile'}>
            <Sidebar.Item
                active={tab === 'profile'}
                icon={HiUser}
                label={'user'}
                labelColor='dark'
                as='div'
               
            >
                Profile
            </Sidebar.Item>
            </Link>
            <Sidebar.Item onClick={handleSignOut} icon={HiArrowSmRight} className='cursor-pointer'>
                Sign out
            </Sidebar.Item>
        </Sidebar.ItemGroup>
    </Sidebar>
  )
}
