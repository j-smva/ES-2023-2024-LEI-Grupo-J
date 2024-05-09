//função generica que cria Buttons
function createButton(text, className, clickHandler, args) {
    // Create a new button element
    let button = document.createElement('button');

    // Set the button text content
    button.textContent = text;

    // Set the button class
    if (className) {
        button.className = className;
    }

    // Add event listener
    button.addEventListener('click', function () {
        // Invoke the click handler if provided
        if (clickHandler && typeof clickHandler === 'function') {
            clickHandler.apply(null, args);
            //clickHandler(arguments);
            //clickHandler();
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


function addHeaderToDiv(level, textContent, div) {
    // Create a new header element based on the specified level
    const header = document.createElement('h' + level);

    // Set the text content of the header
    header.textContent = textContent;

    // Append the header to the specified div
    if (div instanceof HTMLElement) {
        div.appendChild(header);
    } else {
        console.error('Invalid div specified.');
    }
}


function createInput(type, placeholder, className, changeHandler, args) {
    // Create a new input element
    const input = document.createElement('input');

    // Set the input type
    input.type = type || 'text';

    // Set the placeholder text
    input.placeholder = placeholder || '';

    // Set the input class
    if (className) {
        input.className = className;
    }


    if (changeHandler && typeof changeHandler === 'function') {
        // Add event listener
        input.addEventListener('click', function () {
            // Invoke the click handler if provided
            changeHandler.apply(null, args);
        });
    }


    // Return the created input element
    return input;
}


export { createButton, createDiv, addHeaderToDiv, createInput };