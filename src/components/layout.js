import React, {useState} from "react"
import "@fontsource/ibm-plex-mono/500.css"
import "@fontsource/ibm-plex-mono/400.css"
import "@fontsource/ibm-plex-mono/300.css"
import * as s from "./layout.module.css"
import * as Tone from 'tone'
import Controls from "./controls"
import Three from "./ThreeJS"

export default function Layout({ children }) {
  const preventDefault = e => e.preventDefault();

  window.addEventListener('touchmove', preventDefault, {
    passive: false
  });

  const [loaded, setLoaded] = useState(false);

  function toneStart() {
    Tone.start()
    console.log("started!")
    setLoaded(true)
  }

  //style={{display: loaded?"block":"none"}}

  return (
      <div id={s.pagewrap} >
        <div id={s.wrap} hidden={true} >
          <Three loaded={loaded}/>
        </div>
        <Controls />
        <div id={s.loading} onClick={toneStart} style={{opacity: loaded?"0":"1", pointerEvents: loaded?"none":""}} >
          <div id={s.loadingText}>
            <p>welcome to evos.studio<br/><br/>a web based drone<br/>synth/visualizer<br/>built with<br/><a href="https://tonejs.github.io/">Tone.js</a> & <a href="https://threejs.org/">Three.js</a><br/><br/>(when using mobile<br/>make sure silent mode<br/>is turned off)<br/><br/>tap anywhere to<br/>continue...<br/><br/><br/></p>
          </div>
        </div>
      </div>
  )
}