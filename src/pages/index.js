import React from "react"
import Container from "../components/container"
import Layout from "../components/layout"
import { Link, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import * as s from "./index.module.css"

export default function Home( {data} ) {

  return (
    <Layout>
      {/* {data.allMarkdownRemark.edges.map(({ node }) => (
        <Container toLink={node.fields.slug} prev={getImage(node.frontmatter.prevImage)} alt={node.frontmatter.title} title="TEST" />
      ))} */}
    </Layout>
  )
}