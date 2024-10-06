import { useState ,useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import { BrowserRouter, Navigate, Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'

import Auth from './pages/auth'
import Chat from './pages/chat'
import Profile from './pages/profile'
import { useAppStore } from './store'
import { apiClient } from './lib/api-client'
import { GET_USER_INFO } from './utils/constants'


// chat page and auth page

const PrivateRoute = ({children})=>{
  const {userInfo} = useAppStore;
  const isAuthticated =!!userInfo;
  return isAuthticated ? children:<Navigate to="/auth"/> ;
}

const AuthRoute = ({children})=>{
  const {userInfo} = useAppStore;
  const isAuthticated =!!userInfo;
  return isAuthticated ? <Navigate to="/chat"/>: children ;
}

function App() {

  // const [count, setCount] = useState(0)

  const {userInfo,setUserInfo} = useAppStore();
  const [loading, setLoading] = useState(true)


  useEffect(()=>{
    // get data

    const gretUserData = async ()=>{
        
      try{
        const response = await apiClient.get(GET_USER_INFO,{
          withCredentials: true,
        });

        console.log(response);

        if(response.status==200&&response.data.id){
          setUserInfo(response);
        }else{
          setUserInfo(undefined);
        }

      }catch(err){
        console.log(err);
      } finally{
        setLoading(false);
      }

    }

    if(!userInfo){
      gretUserData();
    }else{
      setLoading(false);
    }

  },[userInfo,setUserInfo]);

  if(loading){
    return <div>Loading...</div>
  }


  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/auth" element={
          <AuthRoute> 
            <Auth />
            </AuthRoute>
          }/>
        <Route path="/chat" element={
          <PrivateRoute>
            <Chat/>
            </PrivateRoute>
           }/>
        <Route path="/profile" element={
          <PrivateRoute>
          <Profile/>
          </PrivateRoute>
         }/>
        <Route path="*" element={<Navigate to= "/auth"/>}/>

      </Routes>
      
      </BrowserRouter>
    </>
  )
}

export default App
