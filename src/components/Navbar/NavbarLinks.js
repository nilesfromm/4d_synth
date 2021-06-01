// NavbarLinks.js

import React from "react"
import styled from "@emotion/styled"
import { Link } from "gatsby"

const NavItem = styled(Link)`
  text-decoration: none;
  font-size: 14pt;
  font-family: "Open Sans", sans-serif;
  font-weight: 100;
  color: #354457;
  display: inline-block;
  transition: color 0.25s;
  position: relative;
  margin-right: 30px;
  z-index: 6;
  :hover {
    color: #7C7F8E;
  }
  @media (max-width: 500px) {
    margin-top: 30px;
    margin-right: 0px;
    font-size: 1.5rem;
  }
`
const NavbarLinks = () => {
  return (
    <>
      <NavItem to="/">Projects</NavItem>
      <NavItem to="/About">About</NavItem>
    </>
  )
}

export default NavbarLinks