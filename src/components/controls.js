import React, { useContext } from "react"
import * as s from "./controls.module.css"
import * as Tone from 'tone'
import Osc from "./osc"

export default function Controls() {
//   const [navbarOpen, setNavbarOpen] = useState(false)
//   let [vol, setVol] = useState(-5);
//   let [freq, setFreq] = useState(440);
//   const osc = new Tone.Oscillator(440, "sine").toDestination().start();
  let variance = 2/10000
  let def_freq = 440
  let def_vol = -60
  
  const limiter = new Tone.Limiter(-40).toDestination();

  return (
    <div id={s.wrap}>
      <div className={s.sine}>
        <Osc dest={limiter} Id={3}/>
      </div>
      <div className={s.sine}>
        <Osc dest={limiter} Id={2}/>
      </div>
      <div className={s.sine}>
        <Osc dest={limiter} Id={1}/>
      </div>
      <div className={s.sine}>
        <Osc dest={limiter} Id={0}/>
      </div>
    </div>
  )
}