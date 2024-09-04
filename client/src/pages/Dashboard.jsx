import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashSidebar from './DashSidebar';
import DashProfile from './DashProfile';
import DashhPost from './DashhPost';


export default function Dashboard() {
  const location = useLocation();
  const [tab,setTab] = useState('');
  useEffect(() => {
    const urlParams= new URLSearchParams(location.search);
    const tabFromUrl= urlParams.get('tab');
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
    
  } ,[location.search]);
 
  return (
    <div className='min-h-screen flex flex-col md:flex-row' >
      <div className='md:w-56'> 
        {/*Side bar*/}
        <DashSidebar/>
      </div>
      {/* //profile */}

      {tab === 'profile' && <DashProfile/>}

      {/* Post */}

      {tab === 'post' && <DashhPost/>}
    </div>
  )
}
