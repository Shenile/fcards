import { createNavbar } from "./Navbar.js";

export function createBtn(textContent, className, onclickFunction){
    let btn = document.createElement("button");
    btn.textContent = textContent;
    btn.classList.add(className);
    btn.addEventListener("click", onclickFunction);
    return btn;
};

export function reRenderNav(){
    let navBar = document.getElementById("nav-bar");
    navBar.innerHTML = "";
    navBar.appendChild(createNavbar());
}

export function htmlToElement(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim(); // Avoid text nodes
  return template.content.firstChild;
}