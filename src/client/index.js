// Import the main function and event listener
import { handleSubmit } from "./js/app.js"
import "./styles/style.scss"

// Event listener
document.getElementById("submit").addEventListener("click", handleSubmit)

// Call the function to add event listeners when the DOM is loaded
//document.addEventListener("DOMContentLoaded", addEventListeners)

export { handleSubmit }

