// Logo.js
import React from "react"
import styled from "@emotion/styled"
import Img from "gatsby-image"
import { Link, useStaticQuery, graphql } from "gatsby"
import { withEmotionCache, css } from "@emotion/react"

const LogoWrap = styled.div`
  position:relative;
  height: 50px;
  width: 100px;
  float: left;
  margin: 10px 30px;
  margin-right: 15px;
  .base {
    opacity:1;
    -webkit-transition: opacity .25s;
    transition: opacity .25s;
  }
  .base:hover {
    opacity:0;
  }
`


const Logo = () => {

  return (
      <LogoWrap as={Link} to="/">
        {/* <Img className="base" style={{position: "absolute", width: "100px", height: "50px", zIndex: "10"}} fluid={data.logo1.childImageSharp.fluid} alt="logo" /> */}
        {/* <Img style={{position: "absolute", width: "100px", height: "50px", zIndex: "9"}} fluid={data.logo2.childImageSharp.fluid} alt="logo hover" /> */}
      </LogoWrap>
  )
}

export default Logo