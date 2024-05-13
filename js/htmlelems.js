import { HtmlTableImportModule } from "tabulator-tables";

/**
 * Função genérica que cria botões html em javaScript.
 * @param {String} text - Texto a ser mostrado no botão
 * @param {String} className - Nome da classe do elemento html
 * @param {Function} clickHandler - função que irá dar handle ao clique do botão
 * @param {Array} args - Lista de argumentos a serem passados à função que dará handle ao clique do botão
 * @returns {HTMLElement} - Elemento html com todas as características anteriormente definidas
 */
function createButton(text, className, clickHandler, args) {
    //Cria um novo elemento button
    let button = document.createElement('button');

    //Define o conteúdo de texto do button
    button.textContent = text;

    //Define o nome de classe do button
    if (className) {
        button.className = className;
    }

    //Adiciona o event listener
    button.addEventListener('click', function () {
        //Chama a função passada nos argumentos para dar handle no clique do botão
        if (clickHandler && typeof clickHandler === 'function') {
            clickHandler.apply(null, args);
        }
    });

    return button;
}

/**
 * Função genérica que cria divs html em javaScript.
 * @param {String} className - Nome da classe do elemento html
 * @returns {HTMLElement} - Elemento html div com o nome de classe definido no argumento
 */
function createDiv(className) {
    //Cria um novo elemento div
    const div = document.createElement('div');

    //Define a classe da div
    if (className) {
        div.className = className;
    }

    return div;
}

/**
 * Função genérica que adiciona um elemento html header a uma div pretendida.
 * @param {number} level - nível pretendido para o header
 * @param {String} textContent - conteúdo de texto do header a ser criado
 * @param {HTMLElement} div - Elemento html div ao qual será adicionado o header criado
 */
function addHeaderToDiv(level, textContent, div) {
    //Cria um novo elemento header com o nível pretendido
    const header = document.createElement('h' + level);

    //Define o conteúdo de texto do header.
    header.textContent = textContent;

    //Coloca o elemento header dentro da div
    if (div instanceof HTMLElement) {
        div.appendChild(header);
    } else {
        console.error('Invalid div specified.');
    }
}

/**
 * Função genérica que adiciona um parágrafo a uma div pretendida
 * @param {String} textContent - Conteúdo de texto do parágrafo a ser criado
 * @param {HTMLElement} div - Elemento html div ao qual será adicionado o parágrafo criado
 */
function addParagraphToDiv(textContent, div) {
    //Cria um novo elemento do tipo parágrafo
    const paragraph = document.createElement('p');

    //Define o conteúdo de texto do parágrafo
    paragraph.textContent = textContent;

    //Coloca o parágrafo dentro da div pretendida
    if (div instanceof HTMLElement) {
        div.appendChild(paragraph);
    } else {
        console.error('Invalid div specified.');
    }
}

/**
 * Função genérica que cria elementos html do tipo input
 * @param {String} type - Tipo de input que se pretende, ex: file, number, text, etc.. 
 * @param {String} placeholder - Conteúdo de texto no input enquanto se aguarda por um input
 * @param {String} className - Nome da classe do elemento html input
 * @param {Function} changeHandler - função que dará handle ao resultado da utilização do input
 * @param {Array} args - Argumentos a serem passados a função que dará handle à utilização do input
 * @returns {HTMLElement} - Input criado com os argumentos definidas nos argumentos
 */
function createInput(type, placeholder, className, changeHandler, args) {
    //Cria um novo elemento html input
    const input = document.createElement('input');

    //Define o tipo do elemento input
    input.type = type || 'text';

    //Define o texto placeholder
    input.placeholder = placeholder || '';

    //Define a classe do elemento
    if (className) {
        input.className = className;
    }


    if (changeHandler && typeof changeHandler === 'function') {
        //Adiciona o event listener ao elemento
        input.addEventListener('click', function () {
            //chama a função handler se esta for dada
            changeHandler.apply(null, args);
        });
    }

    return input;
}

/**
 * Função genérica que cria um elemento html do tipo select que possibilita a escolha de multiplas opções e de
 * um botão para dar submit das opções escolhidas.
 * @param {Array} options - Opções a serem mostradas no select
 * @param {String} className - Nome da classe do elemento
 * @param {Function} submitHandler - Função que tratará do resultado da escolha das opções
 * @returns {HTMLElement} - Elemento html do tipo div que contém o select e o botão criados
 */
function createMultiSelect(options, className, submitHandler){
    //Cria os elementos do tipo div e select
    const container = document.createElement('div');
    const select = document.createElement('select');
    select.multiple = true;

    //Define a classe do elemento select
    if(className) {
        select.className = className;
    }

    //Define as opções a serem mostradas no select
    options.forEach(function(option) {
        let optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
    });
    container.appendChild(select);

    //Cria elemento do tipo button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';

    submitButton.addEventListener('click', function() {
        //Define as opções que foram selecionadas
        const selectedOptions = Array.from(select.selectedOptions).map(option => option.value);
        //Chama a função de handling e passa como argumento as opções selecionadas
        if (submitHandler && typeof submitHandler === 'function') {
            submitHandler(selectedOptions);
        }
    });
    container.appendChild(submitButton);
    return container;


}

/**
 * Função genérica que cria dois inputs do tipo date e um botão para submeter as datas escolhidas.
 * @param {String} className - Nome da classe do elemento
 * @param {Function} submitHandler - Função que trata das datas escolhidas
 * @returns {HTMLElement} - Elemento html do tipo div que contém os date inputs e o botão criado
 */
function createDateInputWithSubmit(className, submitHandler) {
    //Cria o elemento html div
    const container = document.createElement('div');
    container.style.display = 'block';

    //Cria a label para o input da data incial
    const startDateLabel = document.createElement('label');
    startDateLabel.textContent = 'Data Inicial: ';
    startDateLabel.setAttribute('for', 'start-date-input');

    //Cria o elemento html input do tipo date para a data inicial
    const startDateInput = document.createElement('input');
    startDateInput.type = 'date';
    startDateInput.id = 'start-date-input';

    //Cria a label para o input da data final
    const endDateLabel = document.createElement('label');
    endDateLabel.textContent = 'Data Final: ';
    endDateLabel.setAttribute('for', 'end-date-input');

    //Cria o elemento html input do tipo date para a data final
    const endDateInput = document.createElement('input');
    endDateInput.type = 'date';
    endDateInput.id = 'end-date-input';

    //Define o nome da classe do elemento
    if (className) {
        startDateInput.className = className;
        endDateInput.className = className;
    }

    //Cria o elemento do tipo button para submeter as escolhas
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';

    //Adiciona o event listener ao button
    submitButton.addEventListener('click', function() {
        //Valores submetidos em ambos os inputs
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        //Chama a função que dá handle com as datas
        if (submitHandler && typeof submitHandler === 'function') {
            submitHandler(startDate, endDate);
        }
    });

    //Coloca todos os elementos criados dentro da div
    container.appendChild(startDateLabel);
    container.appendChild(startDateInput);
    container.appendChild(document.createElement('br')); //Adiciona um line break
    container.appendChild(endDateLabel);
    container.appendChild(endDateInput);
    container.appendChild(document.createElement('br'));
    container.appendChild(submitButton);

    return container;
}

/**
 * Função genérica que cria dois selects com as mesmas opções e um botão para submeter as escolhas
 * @param {Array} options - Opções a serem mostradas nos selects
 * @param {String} className - Nome da classe do elemento
 * @param {Function} submitHandler - Função que trata das opções escolhidas
 * @returns {HTMLElement} - Elemento html do tipo div que contém os selects e o botão criado
 */
function createDualSelect(options, className, submitHandler) {
    const container = document.createElement('div');

    //Cria o primeiro select
    const select1 = document.createElement('select');
    if (className) {
        select1.className = className;
    }

    //Adiciona as opções ao select
    options.forEach(function(option) {
        let optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select1.appendChild(optionElement);
    });
    container.appendChild(select1);

    //Cria o segundo select
    const select2 = document.createElement('select');
    if (className) {
        select2.className = className;
    }

    //Adiciona as opções ao segundo select
    options.forEach(function(option) {
        let optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select2.appendChild(optionElement);
    });
    container.appendChild(select2);

    //Cria o botão
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';

    //Adiciona o event listener ao botão
    submitButton.addEventListener('click', function() {
        //Obtém as opções selecionadas
        const selectedOption1 = select1.value;
        const selectedOption2 = select2.value;
        //Chama a função de handle com os argumentos passados
        if (submitHandler && typeof submitHandler === 'function') {
            submitHandler(selectedOption1, selectedOption2);
        }
    });
    container.appendChild(submitButton);

    return container;
}

/**
 * Função genérica que cria elementos do tipo checkbox baseado numa lista de opções fornecida e um botão para submeter as opções escolhidas
 * @param {Array} options - Opções a serem incluídas nas checkboxes 
 * @param {String} className - Nome da classe do elemento
 * @param {Function} submitHandler - Função que trata das opções escolhidas 
 * @returns {HTMLElement} - Elemento html do tipo div que contém as checkboxes e o botão criados
 */
function createCheckboxes(options, className, submitHandler) {
    //Cria a div onde serão inseridos os restantes elementos
    const container = document.createElement('div');

    //Cria as checkboxes para cada opção
    options.forEach(function(option, index) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = index + 1; //Associa os valores com o idex (a começar de index 1)
        const label = document.createElement('label');
        label.textContent = option;

        //Adiciona a checkbox e a sua label à div 
        container.appendChild(checkbox);
        container.appendChild(label);
        container.appendChild(document.createElement('br')); //Line break
    });

    //Cria o button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';

    //Adiciona event litener ao button criado
    submitButton.addEventListener('click', function() {
        //Obtém os valores das checkboxes selecionadas
        const selectedOptions = [];
        options.forEach(function(option, index) {
            const checkbox = container.querySelector('input[type="checkbox"][value="' + (index + 1) + '"]');
            if (checkbox.checked) {
                selectedOptions.push(checkbox.value);
            }
        });
        //Chama a função de handle com as opções passadas
        if (submitHandler && typeof submitHandler === 'function') {
            submitHandler(selectedOptions);
        }
    });
    container.appendChild(submitButton);

    //Define a classe do elemento
    if (className) {
        container.className = className;
    }

    return container;
}

/**
 * Função genérica que cria um select que apenas permite a seleção de uma única opção
 * @param {Array} options - Array de opções a serem mostradas no select 
 * @param {String} className - Nome da classe do elemento 
 * @param {Function} submitHandler - Função que trata da opção escolhida 
 * @returns {HTMLElement} - Elemento html do tipo div que contém o select e o botão criados
 */
function createSingleSelect(options, className, submitHandler) {
    //Cria os elementos div e select
    const container = document.createElement('div');
    const select = document.createElement('select');

    //define a classe do elemento
    if (className) {
        select.className = className;
    }

    //coloca as opções dentro do select
    options.forEach(function(option) {
        let optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
    });

    container.appendChild(select);

    //cria o botão para submeter as opções
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';

    submitButton.addEventListener('click', function() {
        //Óbtem as opções selecionadas
        const selectedOption = select.value;
        //Chama a função de handle com as opções selecionadas
        if (submitHandler && typeof submitHandler === 'function') {
            submitHandler(selectedOption);
        }
    });

    container.appendChild(submitButton);

    return container;
}

/**
 * Função genérica que cria inputs do tipo number com um determinado intervalo e um botão para submeter o número escolhido
 * @param {number} step - Intervalo dos números quando forem utilizadas as setas de seleção 
 * @param {String} className - Nome da classe do elemento 
 * @param {Function} submitHandler - Função que trata do número escolhido 
 * @returns {HTMLElement} - Elemento html do tipo div que contém o input e o botão criados
 */
function createNumberInput(step, className, submitHandler) {
    const container = document.createElement('div');

    //Cria o input
    const numberInput = document.createElement('input');
    numberInput.type = 'number';
    numberInput.step = step;

    //Define a classe
    if (className) {
        numberInput.className = className;
    }

    container.appendChild(numberInput);

    //Cria o botão
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';

    submitButton.addEventListener('click', function() {
        //Óbtem o número selecionado
        const selectedNumber = parseFloat(numberInput.value);
        //Chama a função que dá handle ao número selecionado
        if (submitHandler && typeof submitHandler === 'function') {
            submitHandler(selectedNumber);
        }
    });

    container.appendChild(submitButton);
    
    return container;
}


function createDivWAttributes(className, id, height) {
    const div = document.createElement('div');
    if (className) {
        div.className = className;
    }
    if (id) {
        div.id = id;
    }
    if (height) {
        div.style.height = height;
    }
    return div;
}

export { createDivWAttributes ,createNumberInput ,createSingleSelect ,createCheckboxes ,createDualSelect, addParagraphToDiv, createButton, createDiv, addHeaderToDiv, createInput, createMultiSelect, createDateInputWithSubmit };