import { reRenderNav } from "../templates/utils.js";

export function signUp() {
  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  if (formData.password.length < 8) {
    alert("Password must be at least 8 characters long.");
    return;
  }

  // Save using email as key
  localStorage.setItem(formData.email, JSON.stringify(formData));
  alert("Signup successful! You can now log in.");

  // Optionally redirect to login page
  window.location.href = "/pages/login.html";
}

export function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const userData = JSON.parse(localStorage.getItem(email));

  if (userData && userData.password === password) {
    localStorage.setItem("currentUser", JSON.stringify(userData));
    return userData;
  } else {
    alert("Login failed: Incorrect email or password.");
    return null;
  }
}

export function logOut(){
  localStorage.removeItem("currentUser");
  window.location.href = "/pages/home.html";
  reRenderNav();
}

export function isLoggedIn(){
  return (localStorage.getItem("currentUser") !== null);
}
