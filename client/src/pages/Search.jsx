import { Button, Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Search() {
  //step 3 a> for search functionality
  const [sidebarData,setSidebarData]= useState({
    searchTerm:'',
    sort: 'desc',
    category: 'uncategorized'
  });
  const [posts,setPosts]=useState([]);
  const [loading,setLoading]= useState(false);
  const [showMore,setShowMore]= useState(false);

  const location= useLocation();
  const navigate= useNavigate();
  console.log(sidebarData);
  //step 3 b> for search functionality
  useEffect(() => {
    const urlParams=new URLSearchParams(location.search);
    const searchFromUrl= urlParams.get('searchTerm');
    const sortFromUrl= urlParams.get('sort');
    const categoryFromUrl= urlParams.get('category');
    if(searchFromUrl || searchFromUrl || categoryFromUrl ){
      setSidebarData({
        ...sidebarData,
        searchTerm:searchFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }
    const fetchPosts= async () => {
      setLoading(true);
      const searchQuery= urlParams.toString();
      const res= await fetch(`/api/v1/post/getPosts?${searchQuery}`);
      const data= await res.json();
      if(!res.ok){
        setLoading(false);
        return;
      }
      if(res.ok){
        setPosts(data.posts);
        setLoading(false);
        if(data.posts.length === 9){
          setShowMore(true);
        }else{
          setShowMore(false);
        }
      }
    }
    fetchPosts();
  } ,[location.search]);

  const handleChange = async (e) => {
    if(e.target.id === 'searchTerm'){
      setSidebarData({...sidebarData, searchTerm: e.target.value});
    }
    if(e.target.id === 'sort'){
      const order= e.target.value || 'desc';
      setSidebarData({...sidebarData,sort: order});
    }
    if(e.target.id === 'category'){
      const category= e.target.value || 'uncategorized';
      setSidebarData({...sidebarData,category: category});
    }
  }
  const handleSubmit= (e) => {
    e.preventDefault();
    const urlParams= new URLSearchParams(location.search);
    urlParams.set('searchTerm',sidebarData.searchTerm);
    urlParams.set('sort',sidebarData.sort);
    urlParams.set('category',sidebarData.category);
    const searchQuery= urlParams.toString();
      navigate(`/search?${searchQuery}`);
  }

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/v1/post/getPosts?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };
  return (
    <div className='flex flex-col md:flex-row' >
      <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
      <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
        <div className='flex items-center gap-2'>
          <label>Search Term</label>
          <TextInput type='text' placeholder='search...' id='searchTerm' value={sidebarData.searchTerm} onChange={handleChange} className='whitespace-nowrap font-semibold'/>
        </div>
        <div className='flex items-center gap-2'>
          <label>Sort:</label>
          <Select onChange={handleChange} value={sidebarData.sort} id='sort'>
              <option value={'desc'}>Latest</option>
              <option value={'asc'}>Oldest</option>
          </Select>
        </div>
        <div className='flex items-center gap-2'>
          <label className='font-semibold'>Category:</label>
          <Select onChange={handleChange} value={sidebarData.category} id='category'>
              <option value={'uncategorized'}>Uncategorized</option>
              <option value={'javascript'}>JavaScript</option>
              <option value={'reactjs'}>React.js</option>
              <option value={'nextjs'}>Next.js</option>
          </Select>
        </div>
        <Button gradientDuoTone={'purpleToPink'} outline type='submit'>Apply Filter</Button>
      </form>
      </div>
        <div className='w-full'>
            <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>Post Results</h1>
            <div className='flex flex-wrap gap-4 p-7'>
              {!loading && posts.length === 0 &&(
                <p className='text-xl text-gray-500'>No posts found.</p>
              )}
              {loading && <p className='text-xl text-gray-500'>Loaing...</p>}
              {!loading && posts.map((post) => <PostCard key={post._id} post={post}/>)}
              {showMore && (
                <button className='text-teal-500 text-lg hover:underline p-7 w-full'   onClick={handleShowMore}>Show More</button>
              )}
            </div>
        </div>
    </div>
  )
}
