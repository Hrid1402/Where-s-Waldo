import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import map1 from '../assets/map1.png'
import styles from '../styles/game.module.css'
import { ToastContainer, toast } from 'react-toastify';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import 'ldrs/bouncy';
import Timer from '../components/Timer.jsx';


function Game() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [showModal, setShowModal] = useState(false); //change to false
  const [characters, setCharacters] = useState(null);
  
  const [X, setX] = useState(null);
  const [Y, setY] = useState(null);

  const [imgCoordinates, setImageCoordinates] = useState({x: 0, y:0})
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);


  useEffect(()=>{
    fetch("https://where-s-waldo-api.onrender.com/characters?limit=3").then(r=>r.json()).then(r=>setCharacters(r))
  },[])

  function uploadScore(){
    if(username.replace(" ", "") == ""){
      return
    }
    const time = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    fetch("https://where-s-waldo-api.onrender.com/users",{
      method: "POST",
      body:  JSON.stringify({ name: username, time: time}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }).then(r=>r.json()).then(r=>{
      if(r.message){
        navigate("/")
      }
    });
  }


  function updateItemValue(id){
    setCharacters((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, found: true } : item
      )
    );
  };

  function setClickPostMenu(e){
    const img = e.target;
    const rect = img.getBoundingClientRect();
    let X = e.clientX - rect.left;
    let Y = e.clientY - rect.top;
    if(X > 1705){
      X-=210
    }
    setX(X);
    setY(Y);
    setShowMenu(true);
  }
  function handleClick(e){
    const rect = e.target.getBoundingClientRect();
    const imageWidth = e.target.naturalWidth;
    const imageHeight = e.target.naturalHeight;
    if(menuRef.current && !menuRef.current.contains(e.target) && showMenu){
      setShowMenu(false)
    }else{
      setClickPostMenu(e)
      const scaleX = imageWidth / rect.width;
      const scaleY = imageHeight / rect.height;
      
      const X = Math.round((e.clientX - rect.left) * scaleX);
      const Y = Math.round((e.clientY - rect.top) * scaleY);
      setImageCoordinates({x: X, y: Y});
    }
  }
  function checkClick(Target_X, Target_Y, id, name){
    if(Math.abs(imgCoordinates.x-Target_X) < 45 && Math.abs(imgCoordinates.y-Target_Y) < 45){
      toast.success("YOU FOUND " + name.toUpperCase() + "!");
      updateItemValue(id);
    }else{
      toast.error("WRONG SPOT, TRY AGAIN!");
    }
    setShowMenu(false)
  }
  useEffect(()=>{
    if(characters && characters.every((c) => c.found)){
      setShowModal(true)
    }
  },[characters])
  
  return (
    <>
        {
          characters ?
          <>
              <Rodal visible={showModal} onClose={() => navigate("/")} height={530}>
                <h1>You won!</h1>
                <h2>Time: </h2>
                <h2>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</h2>
                <div className={styles.publish}>
                  <h2>Do you want to publish your score?</h2>
                  <div>
                    <h3>Name</h3>
                    <input type="text" required value={username} onChange={(e)=>setUsername(e.target.value)}/>
                  </div>
                  <button onClick={()=>uploadScore()}>Upload</button>
                </div>
              </Rodal>
            <h1>Characters to find:</h1>
            <div className={styles.charactersToFind}>
            {
              characters.map(c=>{
                if(c.found){
                  return
                }
                return(
                  <div key={c.id} className={styles.character}>
                    <h3>{c.name}</h3>
                    <img src={c.url}></img>
                  </div>
                )
              })
            }
            </div>
            <Timer stopTimer={showModal} minutes={minutes} setMinutes={setMinutes} seconds={seconds} setSeconds={setSeconds}/>
            <div ref={menuRef} style={{ left: ((X+10)+"px"), top: (Math.round(Y+200)+"px"), display: showMenu ? "flex" : "none"}} className={styles.chooseCharMenu} >
              <h2>Pick a character</h2>
              {
              characters.map(c=>{
                if(c.found){
                  return
                }
                return(
                  <button key={c.id} onClick={()=>checkClick(c.X, c.Y, c.id, c.name)} className='checkBtn'>
                    <img src={c.url} alt={c.name}></img>
                  </button>
                )
              })
            }
            </div>
            <img src={map1} className={styles.mapImage} onClick={(e)=>handleClick(e)}/>
            <ToastContainer/>
          </> : 
            <>
            <h1>Loading</h1>
            <l-bouncy
              size="45"
              speed="1.75" 
              color="black" 
            ></l-bouncy>
            </>
        }
    </>
  )
}

export default Game