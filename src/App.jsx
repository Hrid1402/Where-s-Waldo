import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import 'ldrs/bouncy';
import './styles/App.css'

function App() {
  const navigate = useNavigate();
  const [users, setUsers] = useState(null);
  useEffect(()=>{
      fetch("https://where-s-waldo-api.onrender.com/users").then(r=>r.json()).then(r=>setUsers(r))
    },[])

  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  return (
    <>
      <h1>Where's Waldo?</h1>
      <div className='maps'>
        <button className='map' onClick={()=>{navigate('/game')}}>
          <h2>Start Game!</h2>
        </button>
      </div>
      <div className='scores'>
        <div className='content'>
        <h2>Score Table</h2>
        {
            !users ?
            <div className='loadingRow'>
              <l-bouncy
              size="75"
              speed="1.75" 
              color="black" 
            ></l-bouncy>
            </div>
            
            :
            users && users.map(u=>{
              return (
              <div className='userRow' key={u.id}>
                <h2>{u.name}</h2>
                <h2>{u.time}</h2>
              </div>)
            })
          }
        </div>
          
      </div>

    </>
  )
}

export default App
