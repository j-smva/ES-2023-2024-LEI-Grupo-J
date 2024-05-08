//função generica que cria Buttons
function createButton(text, className, clickHandler) {
    // Create a new button element
    let button = document.createElement('button');

    // Set the button text content
    button.textContent = text;

    // Set the button class
    if (className) {
        button.className = className;
    }

    // Add event listener
    button.addEventListener('click', function() {
        // Invoke the click handler if provided
        if (clickHandler && typeof clickHandler === 'function') {
            clickHandler();
        }
    });

    // Return the created button element
    return button;
}


function createDiv(className) {
    // Create a new div element
    var div = document.createElement('div');

    // Set the div class
    if (className) {
        div.className = className;
    }
    // Return the created div element
    return div;
}


export { createButton, createDiv };