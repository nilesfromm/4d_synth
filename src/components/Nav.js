import React from "react"

export default function Header(props) {
  return <h1>{props.headerText}</h1>
}



<div id="navwrap">
    <nav class="clearfix">
        <a href="http://nilesfromm.com/" id="logo">
            <img class="f" src="images/Logo1.svg" />
            <img class="s" src="images/Logo5.svg" />      	
        </a>
        <ul class="clearfix">
            <li><a href="http://nilesfromm.com/">Work</a></li>
            <li><a href="http://nilesfromm.com/">Photography</a></li>
            <li><a href="http://nilesfromm.com/about.html">About</a></li>
        </ul>
        <a href="#" id="pull"><div id="logopull"></div></a>
    </nav>
</div>