import React, { useEffect, useRef, useState } from 'react';

function Timer({stopTimer, minutes, setMinutes, seconds, setSeconds}){
    const intervalIdRef = useRef(null)
    useEffect(()=>{
        intervalIdRef.current = setInterval(() => {
            setSeconds(prevSeconds => {
                if (prevSeconds === 59) {
                    setMinutes(prevMinutes=>prevMinutes+1);
                    return 0;
                }
                return prevSeconds + 1;
            });
          }, 1000);
        return () => clearInterval(intervalIdRef.current);
    },[])

    useEffect(() => {
        if(stopTimer){
            clearInterval(intervalIdRef.current);
        }
    }, [stopTimer]);

    return (
        <div className="timer">
            <h2>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</h2>
        </div>
    );
};

export default Timer;