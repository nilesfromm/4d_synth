// Navbar.js

import React, { useState } from "react"
import { StaticImage } from "gatsby-plugin-image"
import { Link } from "gatsby"
import * as s from "./Navbar.module.css"
// import Logo from "./Logo"

export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState(false)

  return (
    <div id={s.navwrap}>
      <div id={s.nav}>
        <Link id={s.logo} to="/">
          <StaticImage
            placeholder="none"
            src="../../images/logoHover.png" 
            alt="logo" 
          />
          <div id={s.logoHover}>
            <StaticImage
              placeholder="none"
              src="../../images/logoBase.png" 
              alt="logo" 
            />
          </div>
        </Link>
        <div 
            id={s.toggle}        
            onClick={() => {
              setNavbarOpen(!navbarOpen);
            }}
        >
          <div id={s.hamburger} className={navbarOpen ? s.open : '' }></div>
        </div>
        <div id={s.menu} className={navbarOpen ? s.open : '' }>
          <Link 
            to="/"
            onClick={() => {
              setNavbarOpen(false);
            }}
          >Projects</Link>
          <Link 
            to="/about"
            onClick={() => {
              setNavbarOpen(false);
            }}
          >About</Link>
        </div>
        {/* className={style.img} src={props.prev} */}
        {/* <Logo */}
      </div>
    </div>
  )
}