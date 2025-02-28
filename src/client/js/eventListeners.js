import { handleSubmit } from './app.js';

function addEventListeners() {
    // Add event listener to the form
    const form = document.getElementById('travel-form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }

    // You can add more event listeners here if needed
}

export { addEventListeners };
