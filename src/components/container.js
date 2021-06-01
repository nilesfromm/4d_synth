import React from "react"
import { Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import * as s from "./Container.module.css"
// import * as s from "./Navbar.module.css"

const Container = (props) => {
  return (
    <div className={s.container}>
      <Link to={props.toLink}>
        <GatsbyImage className={s.imgs} image={props.prev} alt={props.alt} />
        {/* <p className={style.subtitle}>{props.title}</p> */}
      </Link>
    </div>
  )
}

export default Container