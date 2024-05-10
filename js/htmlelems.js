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
    const div = document.createElement('div');

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

function addParagraphToDiv(textContent, div) {
    // Create a new paragraph element
    const paragraph = document.createElement('p');

    // Set the text content of the paragraph
    paragraph.textContent = textContent;

    // Append the paragraph to the specified div
    if (div instanceof HTMLElement) {
        div.appendChild(paragraph);
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

function createMultiSelect(options, className, submitHandler){
    var container = document.createElement('div');
    var select = document.createElement('select');
    select.multiple = true;

    if(className) {
        select.className = className;
    }

    options.forEach(function(option) {
        let optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
    });

    container.appendChild(select);
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';

    submitButton.addEventListener('click', function() {
        // Get the selected options
        var selectedOptions = Array.from(select.selectedOptions).map(option => option.value);
        // Call the submit handler with the selected options
        if (submitHandler && typeof submitHandler === 'function') {
            submitHandler(selectedOptions);
        }
    });
    container.appendChild(submitButton);
    // Return the container div
    return container;


}

function createDateInputWithSubmit(className, submitHandler) {
    // Create a container div
    const container = document.createElement('div');
    container.style.display = 'block';

    // Create the label for "Data Inicial"
    const startDateLabel = document.createElement('label');
    startDateLabel.textContent = 'Data Inicial: ';
    startDateLabel.setAttribute('for', 'start-date-input');

    // Create the first date input
    const startDateInput = document.createElement('input');
    startDateInput.type = 'date';
    startDateInput.id = 'start-date-input';

    // Create the label for "Data Final"
    const endDateLabel = document.createElement('label');
    endDateLabel.textContent = 'Data Final: ';
    endDateLabel.setAttribute('for', 'end-date-input');

    // Create the second date input
    const endDateInput = document.createElement('input');
    endDateInput.type = 'date';
    endDateInput.id = 'end-date-input';

    // Set class names if provided
    if (className) {
        startDateInput.className = className;
        endDateInput.className = className;
    }

    // Create the submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';

    // Add click event listener to the submit button
    submitButton.addEventListener('click', function() {
        // Get the values of the date inputs
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        // Call the submit handler with the date values
        if (submitHandler && typeof submitHandler === 'function') {
            submitHandler(startDate, endDate);
        }
    });

    // Append the labels, date inputs, and submit button to the container div
    container.appendChild(startDateLabel);
    container.appendChild(startDateInput);
    container.appendChild(document.createElement('br')); // Add a line break
    container.appendChild(endDateLabel);
    container.appendChild(endDateInput);
    container.appendChild(document.createElement('br'));
    container.appendChild(submitButton);
    

    // Return the container div
    return container;
}

function createDualSelect(options, className, submitHandler) {
    const container = document.createElement('div');

    // Create the first select field
    const select1 = document.createElement('select');
    if (className) {
        select1.className = className;
    }

    // Add options to the first select field
    options.forEach(function(option) {
        let optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select1.appendChild(optionElement);
    });
    container.appendChild(select1);

    // Create the second select field
    const select2 = document.createElement('select');
    if (className) {
        select2.className = className;
    }

    // Add options to the second select field
    options.forEach(function(option) {
        let optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select2.appendChild(optionElement);
    });
    container.appendChild(select2);

    // Create the submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';

    // Add click event listener to the submit button
    submitButton.addEventListener('click', function() {
        // Get the selected options
        const selectedOption1 = select1.value;
        const selectedOption2 = select2.value;
        // Call the submit handler with the selected options
        if (submitHandler && typeof submitHandler === 'function') {
            submitHandler(selectedOption1, selectedOption2);
        }
    });
    container.appendChild(submitButton);

    // Return the container div
    return container;
}

function createCheckboxes(options, className, submitHandler) {
    const container = document.createElement('div');

    // Create checkboxes for each option
    options.forEach(function(option, index) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = index + 1; // Associate value with index (starting from 1)
        const label = document.createElement('label');
        label.textContent = option;

        // Append checkbox and label to container
        container.appendChild(checkbox);
        container.appendChild(label);
        container.appendChild(document.createElement('br')); // Line break
    });

    // Create submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';

    // Add click event listener to the submit button
    submitButton.addEventListener('click', function() {
        // Get the values of the checked checkboxes
        const selectedOptions = [];
        options.forEach(function(option, index) {
            const checkbox = container.querySelector('input[type="checkbox"][value="' + (index + 1) + '"]');
            if (checkbox.checked) {
                selectedOptions.push(checkbox.value);
            }
        });
        // Call the submit handler with the selected options
        if (submitHandler && typeof submitHandler === 'function') {
            submitHandler(selectedOptions);
        }
    });
    container.appendChild(submitButton);

    // Set class name if provided
    if (className) {
        container.className = className;
    }

    // Return the container div
    return container;
}


export { createCheckboxes ,createDualSelect, addParagraphToDiv, createButton, createDiv, addHeaderToDiv, createInput, createMultiSelect, createDateInputWithSubmit };