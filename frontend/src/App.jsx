import React from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'

import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import NotificationPage from './pages/NotificationPage'
import ProfilePage from './pages/ProfilePage'

import Sidebar from './components/Sidebar'
import RightPanel from './components/RightPanel'
import FullPageLoadingSpinner from './components/FullPageLoadingSpinner'


export default function App() {
  
  //This function runs by default

  const {data:authUser ,isLoading}=useQuery({
    queryKey:['authUser'], //Function can be called using this key
    queryFn:async ()=>{
      try
      {
         const res=await fetch('/api/auth/getMe');
         const data=await res.json();

         if (data.error) return null; //If error present,Return false instead of empty object (undefined)

         if (!res.ok) throw new Error(data.error || 'Something went wrong');
         console.log("Get me data",data);
         return data; //True Value
      }
      catch (error) 
      {
         throw new Error(error.message);
      }  
    },
    retry:1, //By default, React Query retries failed queries 3 timesa fter initial fetch. Here one one retry after inital fetch
   })

   if (isLoading) return <FullPageLoadingSpinner/>;

   console.log("Auth User",authUser);

  //If you render <LoginPage /> directly, the URL remains /, even though the login page is displayed

  const bg =  !authUser ? "flex bg-cover bg-center bg-no-repeat bg-[url('./bg.jpg')]" : "flex";
  console.log("bg from frontend",bg);

  return (
    <div className={bg}>
      {authUser &&  <Sidebar/>}    
       <Routes>
          <Route path='/' element={authUser ? <HomePage/> : <Navigate to='/login'/>}/>
          <Route path='/signup' element={!authUser ? <SignupPage/> : <Navigate to='/'/>}/>
          <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to='/'/>}/>
          <Route path='/notifications' element={authUser ? <NotificationPage/> : <Navigate to='/login'/>}/>
          <Route path='/profile/:username' element={authUser ? <ProfilePage/> : <Navigate to='/login'/>}/>
       </Routes>  
       {authUser && <RightPanel/> }         
       <Toaster/>
    </div>
  )
}
