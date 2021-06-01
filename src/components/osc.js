import React, { useState, useRef, useEffect } from "react"
import { Link } from "gatsby"
import * as s from "./osc.module.css"
import * as Tone from 'tone'
import Dial from "./dial"


const Osc = (props) => {
    const [freq, setFreq] = React.useState(50);
    let variance = 2/10000
    let def_freq = 440
    let def_vol = -60
    // console.log(props.dest);
    const vol = useRef(new Tone.Volume(def_vol*(1+variance)).connect(props.dest));
    const osc = useRef(new Tone.Oscillator(Number(def_freq*(1+variance)),"sine").connect(vol.current));

    useEffect(() => {
        vol.current.volume.value = -60.0
        osc.current.frequency.value = 440
    },[])

    const setF = (f) => {
        osc.current.frequency.value = Number(f*(1+variance));
        setFreq(f);
    }
    const setV = (v) => {
        vol.current.volume.value = Number(v*(1+variance))
    }

    return (
        <div id={s.osc}>

            <input 
            type="range" 
            className={s.slider}
            id={"v" + props.Id} 
            min="-60.0" 
            max="0.0" 
            step="0.01"
            defaultValue={def_vol}
            onChange={(event) => {
                setV(event.target.value);
                if(event.target.value<-59){
                  osc.current.stop();
                }
                else if(osc.current.state == 'stopped'){
                  osc.current.start();
                }
                // Tone.start();
            }}/>
            <div className={s.dial}>
                <Dial 
                    value={osc.current.frequency.value} 
                    onChange={setF}
                    min={20}
                    max={1000}
                    // scale={500} 
                />
            </div>
            <h1 className={s.noselect}>{Math.round(osc.current.frequency.value)}</h1>
        </div>
    )
}

export default Osc