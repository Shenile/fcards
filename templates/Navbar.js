import { logOut } from "../scripts/auth.js";
import { createBtn } from "./utils.js";

export function createNavbar() {
  let navLinks = [
    {
      name: "My Collections",
      url: "/pages/collections.html",
      is_active: false,
      private_route: true,
    }
  ];

  const isLoggedIn = localStorage.getItem("currentUser");

  // Filter private routes if user not logged in
  if (!isLoggedIn) {
    navLinks = navLinks.filter((route) => !route.private_route);
  }

  // main nav container
  const nav = document.createElement("nav");
  nav.classList.add("nav-bar-main", "shadow-box");

  // logo
  const logo = document.createElement("p");
  logo.textContent = "FCards";
  logo.classList.add("logo");
  logo.addEventListener("click", () => {
    window.location.href = "/index.html";
  });
  nav.appendChild(logo);

  // section for links/buttons
  const secDiv = document.createElement("div");
  secDiv.classList.add("sec-div");

  // nav links
  navLinks.forEach((navLink) => {
    const link = document.createElement("a");
    link.classList.add("nav-link");
    if (window.location.pathname === navLink.url) {
      link.classList.add("active-link");
    }
    link.textContent = navLink.name;
    link.href = navLink.url;
    secDiv.appendChild(link);
    // if (navLink.private_route) secDiv.appendChild(link);
  });

  if (isLoggedIn) {
    const logOutBtn = createBtn("Log out", "auth-btn", logOut);
    secDiv.appendChild(logOutBtn);
  } else {
    // sign up button
    const signUpAction = () => {
      window.location.href = "/pages/SignUp.html";
    };
    const signUpBtn = createBtn("Sign Up", "auth-btn", signUpAction);
    secDiv.appendChild(signUpBtn);

    // login button
    const logInAction = () => {
      window.location.href = "/pages/login.html";
    };
    const logInBtn = createBtn("Log In", "auth-btn", logInAction);
    secDiv.appendChild(logInBtn);
  }

  nav.appendChild(secDiv);

  return nav;
}
// export navbar element
export const Navbar = createNavbar();
