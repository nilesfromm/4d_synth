import React, { useRef, useEffect, useState } from "react"
import * as s from "./loading.module.css"
import * as Tone from 'tone'
import Osc from "./osc"

export default function Loading() {
  const limiter = useRef(null);
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => (
    limiter.current = new Tone.Limiter(-40).toDestination(),
    setLoaded(true)
    // console.log(limiter.current)
  ), [])

  console.log(limiter.current);

  if(loaded){
    return (
      <div id={s.wrap}>
        <div className={s.sine}>
          <Osc dest={limiter.current} Id={0}/>
        </div>
        <div className={s.sine}>
          <Osc dest={limiter.current} Id={1}/>
        </div>
        <div className={s.sine}>
          <Osc dest={limiter.current} Id={2}/>
        </div>
        <div className={s.sine}>
          <Osc dest={limiter.current} Id={3}/>
        </div>
      </div>
    )
  }else{
    return( null )
  }
}