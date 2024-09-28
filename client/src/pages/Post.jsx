import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import {Button, Spinner} from 'flowbite-react'

export default function Post() {
    const {postSlug}=useParams();
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);
    const [post,setPost]=useState(null);
    console.log(postSlug);
    useEffect(() => {
        const fetchPost=async () => {
            try {
                setLoading(true);
                const res= await fetch(`/api/v1/post/getPosts?slug=${postSlug}`);
                const data=await res.json();
                if(!res.ok){
                    setLoading(false);
                    setError(true);
                    return;
                }
                if(res.ok){
                    setPost(data.posts[0]);
                    setLoading(false);
                    setError(false);
                }
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        }
        fetchPost();
    } ,[postSlug])

    if(loading){
        return <div className='flex justify-center items-center min-h-screen'>
            <Spinner size={'xl'}/>
        </div>
    }
  return (
   <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
        <h1 className='text-3xl font-serif mt-10 p-3 text-center max-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1>
        <Link to={`/search?category=${post && post.category}`} className='self-center mt-5'>
            <Button color={'gray'} pill size={'xs'}>{post && post.category}</Button>
        </Link>
        <img src={post && post.image} alt={post && post.title} className='mt-10 p-4 max-h-[600px] w-full object-cover'/>
        <div className='flex justify-between border-b border-slate-500 max-w-2xl mx-auto p-3 w-full text-xs'>
            <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
            <span>{post && (post.content.length / 1000).toFixed(0)}mins read</span>
        </div>
        <div className='p-3 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{__html: post && post.content}}>
        </div>
   </main>
    
  )
}