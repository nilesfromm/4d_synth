import React, { useState, useRef, useEffect } from "react"
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
  // const vol1 = useRef(new Tone.Volume(-30*(1+variance)).connect(limiter));
  // const vol2 = useRef(new Tone.Volume(-30*(1+variance)).connect(limiter));
  // const vol3 = useRef(new Tone.Volume(-30*(1+variance)).connect(limiter));
  // const vol4 = useRef(new Tone.Volume(-30*(1+variance)).connect(limiter));
  // const osc1 = new Tone.Oscillator(Number(def_freq*(1+variance)),"sine").connect(vol1.current);
  // const osc2 = new Tone.Oscillator(Number(def_freq*(1+variance)),"sine").connect(vol2.current);
  // const osc3 = new Tone.Oscillator(Number(def_freq*(1+variance)),"sine").connect(vol3.current);
  // const osc4 = new Tone.Oscillator(Number(def_freq*(1+variance)),"sine").connect(vol4.current);

  // const stop = () => {
  //   vol1.current.connect(limiter).stop();
  //   vol2.current.connect(limiter).stop();
  //   vol3.current.connect(limiter).stop();
  //   vol4.current.connect(limiter).stop();
  //   osc1.current.connect(vol1).stop()
  //   osc2.current.connect(vol2).stop()
  //   osc3.current.connect(vol3).stop()
  //   osc4.current.connect(vol4).stop()
  // }

  // useEffect(() => {
  //   vol1.current.volume.value = -60.0
  //   osc1.frequency.value = 440
  //   vol2.current.volume.value = -60.0
  //   osc2.frequency.value = 440
  //   vol3.current.volume.value = -60.0
  //   osc3.frequency.value = 440
  //   vol4.current.volume.value = -60.0
  //   osc4.frequency.value = 440
  //   // return stop
  // },[])

  // const setF = (o,f) => {
  //   o.current.frequency.value = Number(f*(1+variance))
  // }
  // const setV = (o,v) => {
  //   o.current.volume.value = Number(v*(1+variance))
  // }

  return (
    <div id={s.wrap}>
      <div className={s.sine}>
        <Osc dest={limiter} Id="1"/>
      </div>
      <div className={s.sine}>
        <Osc dest={limiter} Id="2"/>
      </div>
      <div className={s.sine}>
        <Osc dest={limiter} Id="3"/>
      </div>
      {/* <div className={s.sine}>
        <Osc dest={limiter} Id="4"/>
      </div> */}
    </div>
  )
}