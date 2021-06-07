import React, { useState, useRef, useEffect } from "react"
import * as s from "./osc.module.css"
import * as Tone from 'tone'
import Dial from "./dial"
import { getState, useStore } from "../utils/store"

function Osc ({
    dest,
    Id,
}){
    let def_vol = -60
    const { osc, setFreq, setAmp } = useStore()

    const oscVals = useRef(useStore.getState().osc)

    useEffect(() => useStore.subscribe(
        (osc) => (oscVals.current = osc),
        state => state.osc,
    ), [])

    const ampRef = useRef(null);
    const freqRef = useRef(null);

    useEffect(() => (
        ampRef.current = new Tone.Volume(osc[Id].amp).connect(dest),
        freqRef.current = new Tone.Oscillator(osc[Id].freq,"sine").connect(ampRef.current)
    ), [])

    const setF = (f) => {
        setFreq(Id,f)
        freqRef.current.frequency.value = f;
    }
    const setV = (v) => {
        setAmp(Id,v)
        console.log(-30 + v/2)
        ampRef.current.volume.value = -30 + v/3;
    }
    // console.log(Id);

    return (
        <div id={s.osc}>
            <input 
            type="range" 
            className={s.slider}
            id={"v" + Id} 
            min="-60.0" 
            max="0.0" 
            step="0.01"
            defaultValue={def_vol}
            onChange={(event) => {
                setV(event.target.value);
                if(event.target.value<-59){
                  freqRef.current.stop();
                }
                else if(freqRef.current.state == 'stopped'){
                  freqRef.current.start();
                }
                Tone.start();
            }}/>
            <div className={s.dial}>
                <Dial 
                    value={osc[Id].freq} 
                    onChange={setF}
                    min={20}
                    max={1000}
                    // scale={500} 
                />
            </div>
            <h1 className={s.noselect}>{Math.round(osc[Id].freq)}</h1>
        </div>
    )
}

export default Osc