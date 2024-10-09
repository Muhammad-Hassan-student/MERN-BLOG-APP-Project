import React, { useEffect, useState } from 'react'
import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon,FaSun } from 'react-icons/fa'
import { useSelector,useDispatch } from 'react-redux'

import { toggleTheme } from '../redux/theme/themeSlice'
import { signOutSuccess } from '../redux/user/userSlice'


export default function Header() {
    const path = useLocation().pathname;
    const location = useLocation();
    const naviagte=useNavigate();
    const dispatch=useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const {theme} =useSelector(state => state.theme)
    const [searchTerm,setSearchTerm]=useState('');
   //step 1 for search functionality
    useEffect(() => {
        const urlParams=new URLSearchParams(location.search);
        const searchFromUrl= urlParams.get('searchTerm');
        if(searchFromUrl){
            setSearchTerm(searchFromUrl);
        }
    } ,[location.search])

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
      //step b> 2 for search functionality
      const handleSubmit= async (e) => {
        e.preventDefault();
        const urlParams= new URLSearchParams(location.search);
        urlParams.set('searchTerm',searchTerm);
        const searchQuery= urlParams.toString();
        naviagte(`/search?${searchQuery}`);
      }
    return (
        <Navbar className='border-b-2'>
            <Link to={'/'} className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'><span className='px-1 py-1 bg-gradient-to-r from-green-500 via-teal-400 to-indigo-400 rounded-lg text-white'>Hassan's</span>BLOG</Link>

            <form onSubmit={handleSubmit}>
                <TextInput
                    type='text'
                    placeholder='search...'
                    rightIcon={AiOutlineSearch}
                    className='hidden lg:inline'
                    value={searchTerm}
                    //step 2 a> for search functionality
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>
            <Button className='w-12 h-10 lg:hidden' color={'gray'} pill >
                <AiOutlineSearch />
            </Button>

            <div className='flex gap-2 md:order-2'>
                <Button className='w-12 h-10 hidden sm:inline' color={'gray'} pill onClick={() => dispatch(toggleTheme())}>
                   {theme === 'light' ? <FaMoon/> : <FaSun/>}
                </Button>
                {currentUser ? (
                   
                        <Dropdown 
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar 
                                alt='user'
                                title='user'
                                img={currentUser.profilePicture}
                                rounded
                            />
                        }
                       
                        >
                            <Dropdown.Header>
                                <span className='block text-sm'>{currentUser.username}</span>
                                <span className='block text-sm font-medium truncate'>@{currentUser.email}</span>
                            </Dropdown.Header>
                            <Link to={'/dashboard?tab=profile'}>
                            <Dropdown.Item>
                                Profile
                            </Dropdown.Item>
                            </Link>
                            <Dropdown.Divider/>
                           
                            <Dropdown.Item onClick={handleSignOut}>
                                Sign out
                            </Dropdown.Item>
                           

                        </Dropdown>
                   
                ) : (
                    <>
                        <Link to={'/sign-up'}>
                            <Button gradientDuoTone="redToYellow" outline>Sign In</Button>
                        </Link>
                    </>
                )}
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link active={path === '/'} as={'div'}>
                    <Link to={'/'}>Home</Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/projects'} as={'div'}>
                    <Link to={'/projects'}>Projects</Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/about'} as={'div'}>
                    <Link to={'/about'}>About</Link>
                </Navbar.Link>
                <Button className='w-12 h-10 sm:hidden' color={'gray'} pill onClick={() => dispatch(toggleTheme())}>
                   {theme === 'light' ? <FaMoon/> : <FaSun/>}
                </Button>
            </Navbar.Collapse>



        </Navbar>
    )
}
