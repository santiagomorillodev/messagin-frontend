import { useEffect, useState } from 'react';
import photo from '../assets/photo.jpg'
import Header from '../components/Header'
import { NavigationBar } from '../components/NavigationBar'
import { Posts } from '../components/Posts'
import useGetAllPosts from '../hooks/useGetAllPosts';
import useGetCurrentUser from '../hooks/useGetCurrentUser';

export function Status ()  {
  const {currentUser, loading, error} = useGetCurrentUser();
  const {allPosts} = useGetAllPosts();
  console.log(allPosts);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white">
        Loading status...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-red-400">
        Error loading status.
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4  md:min-w-[385px] border-r border-neutral-500 mb-15 md:mb-0'>
      <Header sectionName={'Updates'}/>
      <section className='flex flex-col gap-4 py-4 px-6 mb-24'>
        {
          allPosts && allPosts.length > 0 ? (
            allPosts.map((post) => (
              <Posts
                key={post.id} 
                id={post.id} 
                userId={post.id_user} 
                name={post.user.name} 
                avatar={post.user.avatar_url} 
                postText={post.content} 
                postImage={post.url} 
                likes={post.likes}/>
            ))
          ) : (
            <p>No posts available.</p>
          )
        }
        
      </section>
      <div className='md:hidden'><NavigationBar/></div>
    </div>
  )
}
