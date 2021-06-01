import React from "react"
//import { Global, css, jsx } from "@emotion/react"
// import styled from "@emotion/styled"
import "@fontsource/ibm-plex-mono/500.css"
import "@fontsource/ibm-plex-mono/400.css"
import "@fontsource/ibm-plex-mono/300.css"
import * as s from "./layout.module.css"
// import Navbar from "./Navbar/Navbar"
import Controls from "./controls"
import Three from "./ThreeJS"

export default function Layout({ children }) {
  return (
    <div id={s.pagewrap}>
      {/* <Navbar /> */}
      <div id={s.wrap}>
        {/* {children} */}
        <Three />
      </div>
      <Controls />
    </div>
  )
}