import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { generateFilterExpression, customFilter, formatString } from './filters';
import { dataParseHorario, dataParseSalas, extractAttributes, extractNomeSalas, getUCs, getCursos, getTurmas } from './utils';
import { generateClassDuration, generateSubClasses, generateTimeStamps, removeDuplicatesTimestamps, removeSalasFromList, setAulaforSub, setDatas, setDatasBasedOnSub, setSalas, setSalasByType, setSingleDay, setWeekDays, removeSelectedWeekdaysFromMap, datasLength, setCursos, setTurmas, setAulas, setTamanhoAula, getAulaforSub, setSemestre, getNumAulas } from './suggestion';
import dateCraft from 'date-craft';
import { turnToDate, getArrayDatesBetween } from './calcSemanas';
import { handleGithubDataHeatmap, salasSetter, datasSetter, setMatrix, createHeatMap } from './heatmap'


//https://raw.githubusercontent.com/j-smva/ES-2023-2024-LEI-Grupo-J/main/CSVs/HorarioDeExemplo.csv

/**
 * Tabela placeholder
 * @type {Tabulator}
 */
var table = new Tabulator("#example-table", {
    pagination: "local",
    paginationSize: 10,
    paginationSizeSelector: [5, 10, 20, 40],
    paginationCounter: "rows",
    placeholder: "Awaiting Data, Please Load File",
});

/**
 * Final Table
 * @type {Tabulator}
 */
var tablefinal;

/**
 * Filtros provenientes dos header inputs das colunas da tabela
 * @type {Array<String>}
 */
var headerFilters;

var filterMatrix = [];
var counter = 0;
var cur_filter;
var dataSalas;
var nomeSalas = [];
var tipoSalas = [];
var tabledata;
var aulaParaSubstituicao;


document.addEventListener('DOMContentLoaded', function () {
    const githubButton = document.getElementById('githubButton');
    const localButton = document.getElementById('localButton');
    const githubButtonSalas = document.getElementById('githubButtonSalas');
    const localButtonSalas = document.getElementById('localButtonSalas');
    const substituirAula = document.getElementById('substituirAula');
    const AulasUC = document.getElementById('AulasUC');
    githubButtonSalas.addEventListener('click', function () {
        const githubLink = document.getElementById('githubLinkSalas').value;
        gitHubCSVSalas(1, githubLink);
    });
    githubButton.addEventListener('click', gitHubCSVHorario);
    localButton.addEventListener('change', function (event) {
        // Get the selected file(s)
        const file = event.target.files[0];
        //console.log(tablefinal);

        // Check if a file was selected
        if (file) {
            // Check if the selected file is a CSV file
            if (file.type === 'text/csv') {
                // Create a FileReader object
                const reader = new FileReader();

                // Set up event listener for when file reading is finished
                reader.onload = function (event) {
                    // event.target.result contains the contents of the file
                    const fileContent = event.target.result;
                    // Here you can process the CSV contents as needed
                    tabledata = dataParseHorario(fileContent);
                    //console.log(tabledata);
                    createTableHorario(tabledata);
                };

                // Read the contents of the selected file as text
                reader.readAsText(file);
            } else {
                // Selected file is not a CSV file, display an error message
                console.error('Please select a CSV file.');
            }
        } else {
            // No file selected, display an error message
            console.error('No file selected.');
        }
    });
    localButtonSalas.addEventListener('change', function (event) {
        // Get the selected file(s)
        const file = event.target.files[0];

        // Check if a file was selected
        if (file) {
            // Check if the selected file is a CSV file
            if (file.type === 'text/csv') {
                // Create a FileReader object
                const reader = new FileReader();

                // Set up event listener for when file reading is finished
                reader.onload = function (event) {
                    // event.target.result contains the contents of the file
                    const fileContent = event.target.result;
                    // Here you can process the CSV contents as needed
                    tabledata = dataParseSalas(fileContent);
                    //console.log(tabledata);
                    createTableSalas(tabledata);
                };

                // Read the contents of the selected file as text
                reader.readAsText(file);
            } else {
                // Selected file is not a CSV file, display an error message
                console.error('Please select a CSV file.');
            }
        } else {
            // No file selected, display an error message
            console.error('No file selected.');
        }
    });
    substituirAula.addEventListener('click', paramsSubstituicao);
    AulasUC.addEventListener('click', paramsUC);
    const graphButton = document.getElementById("graphButton");

    graphButton.addEventListener("click", function () {
        var messageDiv = document.getElementById("params");
        messageDiv.textContent = ""; // Clear any previous content
        messageDiv.style.display = "block";

        var githubInput = document.createElement("input");
        githubInput.setAttribute("type", "text");
        githubInput.setAttribute("placeholder", "Enter GitHub raw link...");
        githubInput.value = "https://raw.githubusercontent.com/j-smva/ES-2023-2024-LEI-Grupo-J/main/CSVs/CaracterizaçãoDasSalas.csv";
        messageDiv.appendChild(githubInput);

        console.log("GitHub input added");

        // Add button to submit GitHub link
        var submitGithubButton = document.createElement("button");
        submitGithubButton.textContent = "Submit GitHub Link";
        submitGithubButton.onclick = function () {
            const githubLink = githubInput.value;
            gitHubCSVSalas(4, githubLink);
            messageDiv.style.display = "none";
        };
        messageDiv.appendChild(submitGithubButton);

        console.log("GitHub button added");
    })

});
function paramsUC() {
    var messageDiv = document.getElementById("params");
    messageDiv.textContent = ""; // Clear any previous content
    messageDiv.style.display = "block";

    console.log("Message added");

    // Add input field for GitHub raw link
    var githubInput = document.createElement("input");
    githubInput.setAttribute("type", "text");
    githubInput.setAttribute("placeholder", "Enter GitHub raw link...");
    messageDiv.appendChild(githubInput);

    console.log("GitHub input added");

    // Add button to submit GitHub link
    var submitGithubButton = document.createElement("button");
    submitGithubButton.textContent = "Submit GitHub Link";
    submitGithubButton.onclick = function () {
        const githubLink = githubInput.value;
        gitHubCSVSalas(3, githubLink);
        messageDiv.style.display = "none";
    };
    messageDiv.appendChild(submitGithubButton);

    console.log("GitHub button added");

    // Add line break
    messageDiv.appendChild(document.createElement("br"));

    // Add file input element for local file
    var fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    messageDiv.appendChild(fileInput);
    fileInput.addEventListener("change", function (event) {
        // Get the selected file(s)
        const file = event.target.files[0];

        // Check if a file was selected
        if (file) {
            // Check if the selected file is a CSV file
            if (file.type === 'text/csv') {
                // Create a FileReader object
                const reader = new FileReader();

                // Set up event listener for when file reading is finished
                reader.onload = function (event) {
                    // event.target.result contains the contents of the file
                    const fileContent = event.target.result;
                    // Here you can process the CSV contents as needed
                    handleFileUCS(fileContent);
                    messageDiv.style.display = "none";
                };

                // Read the contents of the selected file as text
                reader.readAsText(file);
            } else {
                // Selected file is not a CSV file, display an error message
                console.error('Please select a CSV file.');
            }
        } else {
            // No file selected, display an error message
            console.error('No file selected.');
        }
    });

    console.log("File input added");


};
function paramsSubstituicao() {
    var messageDiv = document.getElementById("params");
    messageDiv.textContent = ""; // Clear any previous content
    messageDiv.style.display = "block";


    const dataselected = tablefinal.getSelectedData();
    //aulaParaSubstituicao = tablefinal.getSelectedData();
    aulaParaSubstituicao = dataselected[0];
    setAulaforSub(aulaParaSubstituicao); //importante
    //aulaParaSubstituicao = aulaParaSubstituicao[0];

    console.log(aulaParaSubstituicao);
    if (dataselected.length === 0) {
        const messageError = "Aula não selecionada";
        var messagePara = document.createElement("p");
        messagePara.textContent = messageError;
        messageDiv.appendChild(messagePara);
        return;
    } else if (dataselected.length > 1) {
        var message = "Mais do que uma aula selecionada";
        var messagePara = document.createElement("p");
        messagePara.textContent = message;
        messageDiv.appendChild(messagePara);
        return;
    } else {
        var message = "Submeter Ficheiro Salas de Aula";
        var messagePara = document.createElement("p");
        messagePara.textContent = message;
        messageDiv.appendChild(messagePara);
    }
    messageDiv.style.display = "block";

    // Create and append message paragraph

    console.log("Message added");

    // Add input field for GitHub raw link
    var githubInput = document.createElement("input");
    githubInput.setAttribute("type", "text");
    githubInput.setAttribute("placeholder", "Enter GitHub raw link...");
    messageDiv.appendChild(githubInput);

    console.log("GitHub input added");

    // Add button to submit GitHub link
    var submitGithubButton = document.createElement("button");
    submitGithubButton.textContent = "Submit GitHub Link";
    submitGithubButton.onclick = function () {
        const githubLink = githubInput.value;
        gitHubCSVSalas(2, githubLink);
        messageDiv.style.display = "none";
    };
    messageDiv.appendChild(submitGithubButton);

    console.log("GitHub button added");

    // Add line break
    messageDiv.appendChild(document.createElement("br"));

    // Add file input element for local file
    var fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    messageDiv.appendChild(fileInput);
    fileInput.addEventListener("change", function (event) {
        // Get the selected file(s)
        const file = event.target.files[0];

        // Check if a file was selected
        if (file) {
            // Check if the selected file is a CSV file
            if (file.type === 'text/csv') {
                // Create a FileReader object
                const reader = new FileReader();

                // Set up event listener for when file reading is finished
                reader.onload = function (event) {
                    // event.target.result contains the contents of the file
                    const fileContent = event.target.result;
                    // Here you can process the CSV contents as needed
                    handleFileSub(fileContent);
                    messageDiv.style.display = "none";
                };

                // Read the contents of the selected file as text
                reader.readAsText(file);
            } else {
                // Selected file is not a CSV file, display an error message
                console.error('Please select a CSV file.');
            }
        } else {
            // No file selected, display an error message
            console.error('No file selected.');
        }
    });

    console.log("File input added");


};

function handleFileUCS(content) {
    var buttonContainer = document.getElementById("buttonContainer");

    if (!buttonContainer) {
        buttonContainer = document.createElement("div");
        buttonContainer.id = "dropdownContainer";
        document.body.appendChild(buttonContainer);
    }

    var tableData = tablefinal
    var UCs = getUCs(tableData)
    dataSalas = dataParseSalas(content);
    nomeSalas = extractNomeSalas(dataSalas);
    tipoSalas = extractAttributes(dataSalas);
    populateDropdown(UCs, "Nome UCs");
}

function handleFileSub(content) {
    var buttonContainer = document.getElementById("buttonContainer");

    if (!buttonContainer) {
        buttonContainer = document.createElement("div");
        buttonContainer.id = "dropdownContainer";
        document.body.appendChild(buttonContainer); // Append to body or any other parent element
    }

    // Create the "Alocar" button
    const alocarButton = document.createElement("button");
    alocarButton.textContent = "Alocar";
    buttonContainer.appendChild(alocarButton);

    // Add event listeners to the buttons
    alocarButton.addEventListener("click", function () {
        dataSalas = dataParseSalas(content);
        nomeSalas = extractNomeSalas(dataSalas);
        setAulas(1);
        tipoSalas = extractAttributes(dataSalas);
        populateDropdown(nomeSalas, "Nome Sala Alocar");
        console.log("Alocar button clicked");
        buttonContainer.removeChild(alocarButton);
    });


}



function populateDropdown(options, dropdownLabel) {
    // Remove existing dropdown container if it exists
    var existingDropdownContainer = document.getElementById("dropdownContainer");
    if (existingDropdownContainer) {
        existingDropdownContainer.parentNode.removeChild(existingDropdownContainer);
    }

    // Create dropdown container
    var dropdownContainer = document.createElement("div");
    dropdownContainer.id = "dropdownContainer";

    // Create label for dropdown
    var label = document.createElement("label");
    label.textContent = dropdownLabel + ": ";
    dropdownContainer.appendChild(label);

    // Create dropdown element
    var dropdown = document.createElement("select");
    dropdown.multiple = true; // Allow multiple selection
    dropdown.id = "dropdown_" + dropdownLabel; // Set id for later reference
    options.forEach(function (option) {
        var optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.textContent = option;
        dropdown.appendChild(optionElement);
    });

    // Create submit button
    var submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.addEventListener("click", function () {
        handleSubmitFilters(label);
    });

    // Append dropdown and submit button to dropdownContainer
    dropdownContainer.appendChild(dropdown);
    dropdownContainer.appendChild(submitButton);

    // Append dropdownContainer to body or any other parent element
    document.body.appendChild(dropdownContainer);
}


function handleSubmitFilters(label) {
    console.log(label);
    if (label.textContent === "Nome Sala Alocar: ") {
        var selectedNomeOptionsAlocar = Array.from(document.getElementById("dropdown_Nome Sala Alocar").selectedOptions).map(option => option.value);
        //console.log(selectedNomeOptionsAlocar);
        if (selectedNomeOptionsAlocar.length === 0) {
            populateDropdown(tipoSalas, "Tipo Sala Alocar");
        } else {
            setSalas(selectedNomeOptionsAlocar);
            createAllocationOptions();
            //
        }
    } else if (label.textContent === "Tipo Sala Alocar: ") {
        var selectedTipoOptionsAlocar = Array.from(document.getElementById("dropdown_Tipo Sala Alocar").selectedOptions).map(option => option.value);
        if (selectedTipoOptionsAlocar.length === 0) {
            populateDropdown(nomeSalas, "Nome Sala Excluir");
        } else {
            setSalas(setSalasByType(dataSalas, selectedTipoOptionsAlocar));
            createAllocationOptions();
            //
        }
    } else if (label.textContent === "Nome Sala Excluir: ") {
        var selectedNomeOptionsExcluir = Array.from(document.getElementById("dropdown_Nome Sala Excluir").selectedOptions).map(option => option.value);
        if (selectedNomeOptionsExcluir.length === 0) {
            populateDropdown(tipoSalas, "Tipo Sala Excluir");
        } else {
            setSalas(nomeSalas);
            removeSalasFromList(selectedNomeOptionsExcluir);
            createAllocationOptions();
        }
    } else if (label.textContent === "Tipo Sala Excluir: ") {
        var selectedTipoOptionsExcluir = Array.from(document.getElementById("dropdown_Tipo Sala Excluir").selectedOptions).map(option => option.value);
        setSalas(nomeSalas);
        if (selectedTipoOptionsExcluir.length > 0) {
            removeSalasFromList(setSalasByType(dataSalas, selectedTipoOptionsExcluir));
        }
        createAllocationOptions();
    } else if (label.textContent === "Nome UCs: ") {
        var selectedUC = Array.from(document.getElementById("dropdown_Nome UCs").selectedOptions).map(option => option.value);
        if (selectedUC.length > 0) {
            +
                setAulaforSub({ "Curso": "LIGE, LIGE-PL", "Unidade Curricular": selectedUC[0], "Turno": "---", "Turma": "IGE-PL-C2, IGE-PL-C1", "Inscritos no turno": "-", "Dia da semana": "Ter", "Hora início da aula": "18:00:00", "Hora fim da aula": "19:30:00", "Data da aula": "00/00/0000", "Semana do Ano": 43 });
        }
        getSemestre();
    } else if (label.textContent === "Cursos: ") {
        var selectedCursos = Array.from(document.getElementById("dropdown_Cursos").selectedOptions).map(option => option.value);
        if (selectedCursos.length > 0) {
            setCursos(selectedCursos)
        }
        console.log("Done cursos");
        populateDropdown(getTurmas(tablefinal), "Turmas");
    } else if (label.textContent === "Turmas: ") {
        var selectedTurmas = Array.from(document.getElementById("dropdown_Turmas").selectedOptions).map(option => option.value);
        if (selectedTurmas.length > 0) {
            setTurmas(selectedTurmas)
        }
        console.log("Done Turmas");
        createAmountAulasInput("Quantidade de Aulas", 1);
    } else if (label.textContent === "Quantidade de Aulas: ") {
        setAulas(document.getElementById("dropdown_Quantidade de Aulas").value);
        console.log("Done Quantidade de Aulas");
        createAmountAulasInput("Tempo de Aula", 30);
    } else if (label.textContent === "Tempo de Aula: ") {
        setTamanhoAula(document.getElementById("dropdown_Tempo de Aula").value);
        console.log("Done Tempo de Aula");
        populateDropdown(nomeSalas, "Nome Sala Alocar");

    } else if (label.textContent === "nomesSalasTEmp: ") { //flop

        var selectedTipo = Array.from(document.getElementById("dropdown_nomesSalasTEmp").selectedOptions).map(option => option.value);
        if (!selectedTipo) {
            nomeSalas = extractNomeSalas(dataSalas);
            salasSetter(nomeSalas);
        }
        else {
            salasSetter(setSalasByType(dataSalas, selectedTipo));
        }

        createDateInputs(2);

    }
}

function createAmountAulasInput(dropdownLabel, step) {
    // Remove existing dropdown container if it exists
    var existingDropdownContainer = document.getElementById("dropdownContainer");
    if (existingDropdownContainer) {
        existingDropdownContainer.parentNode.removeChild(existingDropdownContainer);
    }

    // Create dropdown container
    var dropdownContainer = document.createElement("div");
    dropdownContainer.id = "dropdownContainer";

    // Create label for dropdown
    var label = document.createElement("label");
    label.textContent = dropdownLabel + ": ";
    dropdownContainer.appendChild(label);

    // Create the number input element
    var numberInput = document.createElement("input");
    numberInput.type = "number";
    numberInput.id = "dropdown_" + dropdownLabel;
    numberInput.name = "quantity";
    numberInput.min = step;
    numberInput.value = step;
    numberInput.step = step;

    // Create submit button
    var submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.addEventListener("click", function () {
        handleSubmitFilters(label);
    });

    // Append dropdown and submit button to dropdownContainer
    dropdownContainer.appendChild(numberInput);
    dropdownContainer.appendChild(submitButton);

    // Append dropdownContainer to body or any other parent element
    document.body.appendChild(dropdownContainer);
}
function createAllocationOptions() {
    // Get the dropdown container
    var dropdownContainer = document.getElementById("dropdownContainer");

    // Clear existing content if it exists
    if (dropdownContainer) {
        dropdownContainer.innerHTML = "";
    } else {
        // Create dropdown container if it doesn't exist
        dropdownContainer = document.createElement("div");
        dropdownContainer.id = "dropdownContainer";
        document.body.appendChild(dropdownContainer); // Append to body or any other parent element
    }

    // Create title for allocation options
    var title = document.createElement("h2");
    title.textContent = "Opções de Alocação";
    dropdownContainer.appendChild(title);

    // Create buttons
    var buttons = ["Mesmo dia", "Mesma Semana", "Entre Datas", "Opções de Exclusão"];
    if (getAulaforSub()["Turno"] == "---") { buttons = ["Entre Datas", "Opções de Exclusão"]; }
    console.log(buttons);
    buttons.forEach(function (buttonText) {
        var button = document.createElement("button");
        button.textContent = buttonText;
        dropdownContainer.appendChild(button);

        // Associate function with button click
        button.addEventListener("click", function () {
            // Call appropriate function based on button text
            switch (buttonText) {
                case "Mesmo dia":
                    setSingleDay();
                    //dropdownContainer.innerHTML = "";
                    createExclusionOptions();
                    console.log("Mesmo dia");
                    break;
                case "Mesma Semana":
                    const weekIni = dateCraft.getStartOfWeek(turnToDate(aulaParaSubstituicao["Data da aula"]));
                    const weekEnd = dateCraft.subtractDays(dateCraft.getEndOfWeek(turnToDate(aulaParaSubstituicao["Data da aula"])), 2);
                    setDatas(weekIni, weekEnd);
                    console.log("Mesma Semana");
                    createExclusionOptions();
                    break;
                case "Entre Datas":
                    //handleBetweenDates();
                    //setDatasBasedOnSub();
                    createDateInputs(1);
                    console.log("Entre Datas");
                    break;
                case "Opções de Exclusão":
                    //handleExclusionOptions();
                    setDatasBasedOnSub();
                    createExclusionOptions();
                    console.log("Opções de Exclusão");
                    break;
                default:
                    // Default action
                    break;
            }
        });
    });
}

function createExclusionOptions() {
    // Get the dropdown container
    var dropdownContainer = document.getElementById("dropdownContainer");

    // Clear existing content if it exists
    if (dropdownContainer) {
        dropdownContainer.innerHTML = "";
    } else {
        // Create dropdown container if it doesn't exist
        dropdownContainer = document.createElement("div");
        dropdownContainer.id = "dropdownContainer";
        document.body.appendChild(dropdownContainer); // Append to body or any other parent element
    }

    // Create title for exclusion options
    var title = document.createElement("h2");
    title.textContent = "Opções de Exclusão";
    dropdownContainer.appendChild(title);

    // Create buttons
    var buttons = ["Manhã", "Tarde", "Noite", "Horas", "Nenhum"];
    buttons.forEach(function (buttonText) {
        var button = document.createElement("button");
        button.textContent = buttonText;
        dropdownContainer.appendChild(button);

        // Associate function with button click
        button.addEventListener("click", function () {
            // Call appropriate function based on button text
            const l = datasLength();
            switch (buttonText) {

                case "Manhã":
                    console.log("Manhã button clicked");
                    generateTimeStamps();
                    removeDuplicatesTimestamps(generateClassDuration("08:00:00", "12:30:00"));
                    if (l === 1) {
                        setWeekDays();
                        createGenerateSuggestionsButton();
                    } else {
                        createWeekdayCheckboxes();
                    }
                    break;
                case "Tarde":
                    console.log("Tarde button clicked");
                    generateTimeStamps();
                    removeDuplicatesTimestamps(generateClassDuration("13:00:00", "18:30:00"));
                    if (l === 1) {
                        setWeekDays();
                        createGenerateSuggestionsButton();
                    } else {
                        createWeekdayCheckboxes();
                    }
                    break;
                case "Noite":
                    console.log("Noite button clicked");
                    generateTimeStamps();
                    removeDuplicatesTimestamps(generateClassDuration("19:00:00", "21:30:00"));
                    if (l === 1) {
                        setWeekDays();
                        createGenerateSuggestionsButton();
                    } else {
                        createWeekdayCheckboxes();
                    }
                    break;
                case "Horas":
                    console.log("Horas button clicked");
                    createTimestampInputs();
                    break;
                case "Nenhum":
                    generateTimeStamps();
                    if (l === 1) {
                        setWeekDays();
                        createGenerateSuggestionsButton();
                    } else {
                        createWeekdayCheckboxes();
                    }
                    break;
                default:
                    // Default action
                    break;
            }
        });
    });
}

function getSemestre() {
    // Get the dropdown container
    var dropdownContainer = document.getElementById("dropdownContainer");

    // Clear existing content if it exists
    if (dropdownContainer) {
        dropdownContainer.innerHTML = "";
    } else {
        // Create dropdown container if it doesn't exist
        dropdownContainer = document.createElement("div");
        dropdownContainer.id = "dropdownContainer";
        document.body.appendChild(dropdownContainer); // Append to body or any other parent element
    }

    // Create title for allocation options
    var title = document.createElement("h2");
    title.textContent = "Semestre da Cadeira";
    dropdownContainer.appendChild(title);

    // Create buttons
    const buttons = ["1º Semestre", "2º Semestre"];
    buttons.forEach(function (buttonText) {
        var button = document.createElement("button");
        button.textContent = buttonText;
        dropdownContainer.appendChild(button);

        // Associate function with button click
        button.addEventListener("click", function () {
            // Call appropriate function based on button text
            switch (buttonText) {
                case "1º Semestre":
                    setSemestre(1);
                    console.log("1º Semestre");
                    populateDropdown(getCursos(tablefinal), "Cursos");
                    break;
                case "2º Semestre":
                    setSemestre(2);
                    console.log("2º Semestre");
                    populateDropdown(getCursos(tablefinal), "Cursos");
                    break;
                default:
                    // Default action
                    break;
            }
        });
    });
}
function createDateInputs(number) {
    // Get the dropdown container
    var dropdownContainer = document.getElementById("dropdownContainer");

    // Clear existing content if it exists
    if (dropdownContainer) {
        dropdownContainer.innerHTML = "";
    } else {
        // Create dropdown container if it doesn't exist
        dropdownContainer = document.createElement("div");
        dropdownContainer.id = "dropdownContainer";
        document.body.appendChild(dropdownContainer); // Append to body or any other parent element
    }

    // Create labels for textboxes
    var labelInicio = document.createElement("label");
    labelInicio.textContent = "Data Início: ";
    dropdownContainer.appendChild(labelInicio);

    // Create textbox for Data Inicio
    var inputInicio = document.createElement("input");
    inputInicio.type = "text";
    inputInicio.id = "dataInicio";
    inputInicio.placeholder = "dd/mm/yyyy";
    dropdownContainer.appendChild(inputInicio);

    // Create labels for textboxes
    var labelFim = document.createElement("label");
    labelFim.textContent = "Data Fim: ";
    dropdownContainer.appendChild(labelFim);

    // Create textbox for Data Fim
    var inputFim = document.createElement("input");
    inputFim.type = "text";
    inputFim.id = "dataFim";
    inputFim.placeholder = "dd/mm/yyyy";
    dropdownContainer.appendChild(inputFim);

    // Add instruction
    var instruction = document.createElement("p");
    instruction.textContent = "Preencher datas no formato dd/mm/yyyy";
    dropdownContainer.appendChild(instruction);

    // Create submit button
    var submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    dropdownContainer.appendChild(submitButton);

    // Add event listener to submit button
    submitButton.addEventListener("click", function () {
        // Get the values from textboxes
        var dataInicio = document.getElementById("dataInicio").value;
        var dataFim = document.getElementById("dataFim").value;

        // Check if both textboxes are filled
        if (dataInicio && dataFim) {
            // Validate date format for both dates

            if (isValidDateFormat(dataInicio) && isValidDateFormat(dataFim)) {
                console.log(dataInicio + "    " + dataFim);
                switch (number) {
                    case 1:
                        // Call a function to handle the submitted data

                        setDatas(turnToDate(dataInicio), turnToDate(dataFim));
                        //dropdownContainer.innerHTML = "";
                        createExclusionOptions();
                        break;
                    case 2:
                        datasSetter(getArrayDatesBetween(turnToDate(dataInicio), turnToDate(dataFim)));
                        console.log(getArrayDatesBetween(turnToDate(dataInicio), turnToDate(dataFim)));
                        createHeatMap(setMatrix(tabledata));
                }
            } else {
                // Alert user about incorrect date format
                alert("Por favor, preencha as datas no formato dd/mm/yyyy.");
            }
        } else {
            // Alert user to fill both textboxes
            alert("Por favor, preencha ambos os campos.");
        }
    });
}

// Function to validate date format (dd/mm/yyyy)
function isValidDateFormat(dateString) {
    var regex = /^\d{2}\/\d{2}\/\d{4}$/;
    return regex.test(dateString);
}

function createTimestampInputs() {
    // Get the dropdown container
    var dropdownContainer = document.getElementById("dropdownContainer");

    // Clear existing content if it exists
    if (dropdownContainer) {
        dropdownContainer.innerHTML = "";
    } else {
        // Create dropdown container if it doesn't exist
        dropdownContainer = document.createElement("div");
        dropdownContainer.id = "dropdownContainer";
        document.body.appendChild(dropdownContainer); // Append to body or any other parent element
    }

    // Create label for start timestamp input
    var startLabel = document.createElement("label");
    startLabel.textContent = "Hora de Início (HH:mm:ss): ";
    dropdownContainer.appendChild(startLabel);

    // Create input element for start timestamp
    var startInput = document.createElement("input");
    startInput.type = "text";
    startInput.id = "startTimestamp";
    dropdownContainer.appendChild(startInput);

    // Create label for end timestamp input
    var endLabel = document.createElement("label");
    endLabel.textContent = "Hora de Fim (HH:mm:ss): ";
    dropdownContainer.appendChild(endLabel);

    // Create input element for end timestamp
    var endInput = document.createElement("input");
    endInput.type = "text";
    endInput.id = "endTimestamp";
    dropdownContainer.appendChild(endInput);

    // Create submit button
    var submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.addEventListener("click", function () {
        // Get the values of start and end timestamps
        var startTimestamp = document.getElementById("startTimestamp").value;
        var endTimestamp = document.getElementById("endTimestamp").value;

        // Check if both timestamps are valid
        if (startTimestamp && endTimestamp) {
            if (isValidTimestampFormat(startTimestamp) && isValidTimestampFormat(endTimestamp)) {
                console.log("Start timestamp:", startTimestamp);
                console.log("End timestamp:", endTimestamp);
                generateTimeStamps();
                removeDuplicatesTimestamps(generateClassDuration(startTimestamp, endTimestamp));
                const l = datasLength();
                if (l === 1) {
                    setWeekDays();
                    createGenerateSuggestionsButton();
                } else {
                    createWeekdayCheckboxes();
                }

            } else {
                alert("Por favor, preencha as horas no formato HH:mm:ss")
            }
        } else {
            // Alert the user if any of the timestamps are invalid
            alert("Por favor, preencha as horas no formato HH:mm:ss.");
        }
    });
    dropdownContainer.appendChild(submitButton);

    // Append container to body or any other parent element
    document.body.appendChild(dropdownContainer);
}


function isValidTimestampFormat(timestamp) {
    // Regular expression to match "HH:mm:ss" format
    var regex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    return regex.test(timestamp);
}


function createWeekdayCheckboxes() {
    // Get the dropdown container
    var dropdownContainer = document.getElementById("dropdownContainer");

    // Clear existing content if it exists
    if (dropdownContainer) {
        dropdownContainer.innerHTML = "";
    } else {
        // Create dropdown container if it doesn't exist
        dropdownContainer = document.createElement("div");
        dropdownContainer.id = "dropdownContainer";
        document.body.appendChild(dropdownContainer); // Append to body or any other parent element
    }

    // Create checkboxes for each day of the week
    var weekdays = ["Seg", "Ter", "Qua", "Qui", "Sex"];
    weekdays.forEach(function (day, index) {
        // Create label for checkbox
        var label = document.createElement("label");
        label.textContent = day + ": ";

        // Create checkbox element
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = index + 1; // Assign value based on index (1-indexed)
        checkbox.name = "weekday"; // Assign common name for all checkboxes
        label.appendChild(checkbox);

        // Append label to container
        dropdownContainer.appendChild(label);
    });

    // Create submit button
    var submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.addEventListener("click", function () {
        // Get the values of selected weekdays
        var selectedWeekdays = [];
        var checkboxes = document.getElementsByName("weekday");
        checkboxes.forEach(function (checkbox) {
            if (checkbox.checked) {
                selectedWeekdays.push(checkbox.value);
            }
        });
        setWeekDays();
        removeSelectedWeekdaysFromMap(selectedWeekdays);
        createGenerateSuggestionsButton();

        // Perform further actions with the selected weekdays
        console.log("Selected weekdays:", selectedWeekdays);
    });
    dropdownContainer.appendChild(submitButton);

    // Append container to body or any other parent element
    document.body.appendChild(dropdownContainer);
}

function createGenerateSuggestionsButton() {
    // Get the dropdown container
    var dropdownContainer = document.getElementById("dropdownContainer");

    // Clear existing content if it exists
    if (dropdownContainer) {
        dropdownContainer.innerHTML = "";
    } else {
        // Create dropdown container if it doesn't exist
        dropdownContainer = document.createElement("div");
        dropdownContainer.id = "dropdownContainer";
        document.body.appendChild(dropdownContainer); // Append to body or any other parent element
    }

    // Create the "Gerar Sugestões" button
    const generateButton = document.createElement("button");
    generateButton.textContent = "Gerar Sugestões";

    // Add event listener to the "Gerar Sugestões" button
    generateButton.addEventListener("click", function () {
        // Your event handler logic goes here
        createTableSugestion();
        console.log("Gerar Sugestões button clicked");
    });

    // Append the button to the dropdown container
    dropdownContainer.appendChild(generateButton);
}

function createTableSugestion() {
    const dropdownContainer = document.getElementById("dropdownContainer");
    if (dropdownContainer) {
        dropdownContainer.remove();
    } else {
        console.log("Dropdown container not found.");
    }

    const suggestionDiv = document.createElement("div");
    suggestionDiv.id = "suggestion"; // Set the id of the div
    document.body.appendChild(suggestionDiv); // Append the div to the body or any other parent element


    const novatabledata = generateSubClasses(tabledata); //flop
    console.log(novatabledata);
    const tableS = new Tabulator("#suggestion", {
        data: novatabledata, // Your data array here,
        layout: "fitColumns", // Adjust table layout as needed
        autoColumns: true,
        pagination: "local",
        paginationSize: 10,
        paginationSizeSelector: [5, 10, 20, 40],
        paginationCounter: "rows",
        headerFilter: true,
        rowHeader: {
            headerSort: false, resizable: false, frozen: true, headerHozAlign: "center", hozAlign: "center", formatter: "rowSelection", titleFormatter: "rowSelection", cellClick: function (e, cell) {
                cell.getRow().toggleSelect();
            }
        },
        footerElement: "<button id='Select'>Selecionar Aula Sub</button>",

    });

    tableS.on("tableBuilt", function () {
        const buttonSub = document.getElementById("Select");

        // Define the event listener function
        function handleClick() {
            const novaAula = tableS.getSelectedData(); // Move the definition here
            if (novaAula.length === 0) {
                alert('Nenhuma aula selecionada.');
            } else if (novaAula.length > getNumAulas()) {
                alert('Maximo numero de aulas ultrapasado.');
            } else {
                if (getAulaforSub()["Turno"] == "---") {
                    setAulas(getNumAulas() - novaAula.length);
                    novaAula.forEach(function (row) {
                        tablefinal.addRow(row, true)
                        console.log("row added");
                    });
                    if (suggestionDiv && getNumAulas() == 0) {
                        suggestionDiv.remove();
                    }
                } else {
                    tablefinal.addRow(novaAula[0], true);
                    console.log("row added");
                    const row = tablefinal.getSelectedRows();
                    row[0].delete();
                    if (suggestionDiv) {
                        suggestionDiv.remove();
                    }
                }
            }
        }

        // Remove the existing event listener, if any
        buttonSub.removeEventListener('click', handleClick);

        // Add the event listener
        buttonSub.addEventListener('click', handleClick);
    });

}


/**
 * Ficheiro CSV de Horario a partir de link do gitHub
 */
function gitHubCSVHorario() {
    const githubLink = document.getElementById('githubLink').value;

    fetch(githubLink)
        .then(response => response.text())
        .then(csvData => {
            tabledata = dataParseHorario(csvData);
            //console.log(tabledata);
            createTableHorario(tabledata);
        })
        .catch(error => {
            console.error('Error fetching CSV data:', error);
        });
};

/**
 * Ficheiro CSV de Salas a partir de link do gitHub
 */
function gitHubCSVSalas(number, githubLink) {
    //const githubLink = document.getElementById('githubLinkSalas').value;
    fetch(githubLink)
        .then(response => response.text())
        .then(csvDataSalas => {
            if (number == 1) {
                tabledata = dataParseSalas(csvDataSalas);
                //console.log(tabledata);
                createTableSalas(tabledata);
                console.log("isto funcionou a gerar tabela");
            } else if (number == 2) {
                handleFileSub(csvDataSalas);
            } else if (number == 3) {
                handleFileUCS(csvDataSalas)
            } else if (number == 4) {

                dataSalas = dataParseSalas(csvDataSalas);
                console.log(dataSalas);
                handleGithubDataHeatmap(dataSalas);
            }


        })
        .catch(error => {
            console.error('Error fetching CSV data:', error);
        });
};



/**
 * 
 * @param {String} tabledata - String em formato JSON com o conteudo da tabela de horario
 */
function createTableHorario(tabledata) {

    tablefinal = new Tabulator("#example-table", {
        layout: "fitColumns",
        data: tabledata,
        rowHeader: {
            headerSort: false, resizable: false, frozen: true, headerHozAlign: "center", hozAlign: "center", formatter: "rowSelection", titleFormatter: "rowSelection", cellClick: function (e, cell) {
                cell.getRow().toggleSelect();
            }
        },
        pagination: "local",
        paginationSize: 10,
        paginationSizeSelector: [5, 10, 20, 40],
        movableColumns: false,
        paginationCounter: "rows",
        footerElement: "<button id='ORtoggle'>OR Filter Toggle</button><button id='ResetFilter'>Reset Filters</button>",
        columns: [
            { title: "Curso", field: "Curso", headerFilter: "input", headerMenu: headerMenu },
            { title: "Unidade Curricular", field: "Unidade Curricular", headerFilter: "input", headerMenu: headerMenu },
            { title: "Turno", field: "Turno", headerFilter: "input", headerMenu: headerMenu },
            { title: "Turma", field: "Turma", headerFilter: "input", headerMenu: headerMenu },
            { title: "Inscritos no Turno", field: "Inscritos no turno", headerFilter: "input", headerMenu: headerMenu },
            { title: "Dia da Semana", field: "Dia da semana", headerFilter: "input", headerMenu: headerMenu },
            { title: "Hora início da aula", field: "Hora início da aula", headerFilter: "input", headerMenu: headerMenu },
            { title: "Hora fim da aula", field: "Hora fim da aula", headerFilter: "input", headerMenu: headerMenu },
            { title: "Data da aula", field: "Data da aula", headerFilter: "input", headerMenu: headerMenu },
            { title: "Características da sala pedida para a aula", field: "Características da sala pedida para a aula", headerFilter: "input", headerMenu: headerMenu },
            { title: "Sala atribuída à aula", field: "Sala atribuída à aula", headerFilter: "input", headerMenu: headerMenu },
            { title: "Semana do Ano", field: "Semana do Ano", headerFilter: "input", headerMenu: headerMenu },
            { title: "Semana do Semestre", field: "Semana do Semestre", headerFilter: "input", headerMenu: headerMenu },
        ],
    });
    tablefinal.on("tableBuilt", addEventListeners);
    tablefinal.on("rowAdded", function (row) {
        console.log("adawdawda");
        // Set the background color of the newly added row to green
        row.getElement().style.backgroundColor = "green";
    });
}

/**
 * 
 * @param {String} tabledata - String em formato JSON com o conteudo da tabela de salas
 */
function createTableSalas(tabledata) {

    tablefinal = new Tabulator("#example-table", {
        layout: "fitData",
        data: tabledata,
        pagination: "local",
        paginationSize: 10,
        paginationSizeSelector: [5, 10, 20, 40],
        movableColumns: false,
        //autoColumns:true,
        paginationCounter: "rows",
        footerElement: "<button id='ORtoggle'>OR Filter Toggle</button><button id='ResetFilter'>Reset Filters</button>",
        columns: [
            { title: "Edifício", field: "Edifício", headerFilter: "input", headerMenu: headerMenu },
            { title: "Nome sala", field: "Nome sala", headerFilter: "input", headerMenu: headerMenu },
            { title: "Capacidade Normal", field: "Capacidade Normal", headerFilter: "input", headerMenu: headerMenu },
            { title: "Capacidade Exame", field: "Capacidade Exame", headerFilter: "input", headerMenu: headerMenu },
            { title: "Nº características", field: "Nº características", headerFilter: "input", headerMenu: headerMenu },
            { title: "Anfiteatro aulas", field: "Anfiteatro aulas", headerFilter: "input", headerMenu: headerMenu },
            { title: "Apoio técnico eventos", field: "Apoio técnico eventos", headerFilter: "input", headerMenu: headerMenu },
            { title: "Arq 1", field: "Arq 1", headerFilter: "input", headerMenu: headerMenu },
            { title: "Arq 2", field: "Arq 2", headerFilter: "input", headerMenu: headerMenu },
            { title: "Arq 3", field: "Arq 3", headerFilter: "input", headerMenu: headerMenu },
            { title: "Arq 4", field: "Arq 4", headerFilter: "input", headerMenu: headerMenu },
            { title: "Arq 5", field: "Arq 5", headerFilter: "input", headerMenu: headerMenu },
            { title: "Arq 6", field: "Arq 6", headerFilter: "input", headerMenu: headerMenu },
            { title: "Arq 9", field: "Arq 9", headerFilter: "input", headerMenu: headerMenu },
            { title: "BYOD (Bring Your Own Device)", field: "BYOD (Bring Your Own Device)", headerFilter: "input", headerMenu: headerMenu },
            { title: "Focus Group", field: "Focus Group", headerFilter: "input", headerMenu: headerMenu },
            { title: "Horário sala visível portal público", field: "Horário sala visível portal público", headerFilter: "input", headerMenu: headerMenu },
            { title: "Laboratório de Arquitectura de Computadores I", field: "Laboratório de Arquitectura de Computadores I", headerFilter: "input", headerMenu: headerMenu },
            { title: "Laboratório de Arquitectura de Computadores II", field: "Laboratório de Arquitectura de Computadores II", headerFilter: "input", headerMenu: headerMenu },
            { title: "Laboratório de Bases de Engenharia", field: "Laboratório de Bases de Engenharia", headerFilter: "input", headerMenu: headerMenu },
            { title: "Laboratório de Electrónica", field: "Laboratório de Electrónica", headerFilter: "input", headerMenu: headerMenu },
            { title: "Laboratório de Informática", field: "Laboratório de Informática", headerFilter: "input", headerMenu: headerMenu },
            { title: "Laboratório de Jornalismo", field: "Laboratório de Jornalismo", headerFilter: "input", headerMenu: headerMenu },
            { title: "Laboratório de Redes de Computadores I", field: "Laboratório de Redes de Computadores I", headerFilter: "input", headerMenu: headerMenu },
            { title: "Laboratório de Redes de Computadores II", field: "Laboratório de Redes de Computadores II", headerFilter: "input", headerMenu: headerMenu },
            { title: "Laboratório de Telecomunicações", field: "Laboratório de Telecomunicações", headerFilter: "input", headerMenu: headerMenu },
            { title: "Sala Aulas Mestrado", field: "Sala Aulas Mestrado", headerFilter: "input", headerMenu: headerMenu },
            { title: "Sala Aulas Mestrado Plus", field: "Sala Aulas Mestrado Plus", headerFilter: "input", headerMenu: headerMenu },
            { title: "Sala NEE", field: "Sala NEE", headerFilter: "input", headerMenu: headerMenu },
            { title: "Sala Provas", field: "Sala Provas", headerFilter: "input", headerMenu: headerMenu },
            { title: "Sala Reunião", field: "Sala Reunião", headerFilter: "input", headerMenu: headerMenu },
            { title: "Sala de Arquitectura", field: "Sala de Arquitectura", headerFilter: "input", headerMenu: headerMenu },
            { title: "Sala de Aulas Normal", field: "Sala de Aulas normal", headerFilter: "input", headerMenu: headerMenu },
            { title: "Videoconferência", field: "videoconferência", headerFilter: "input", headerMenu: headerMenu },
            { title: "Átrio", field: "átrio", headerFilter: "input", headerMenu: headerMenu },
        ],
    });

    tablefinal.on("tableBuilt", addEventListeners);

};

/**
 * Função que adiciona Event Listeners para todos os butões associados à tabela já preenchida
 */
function addEventListeners() {
    const ORtoggle = document.getElementById('ORtoggle');
    const ResetFilter = document.getElementById('ResetFilter');
    cur_filter = document.getElementById('cur_filter');
    const CSV = document.getElementById('CSV');
    const JSON = document.getElementById('JSON');

    ResetFilter.removeEventListener('click', resetFilters);
    ORtoggle.removeEventListener('click', toggleFilter);
    CSV.removeEventListener('click', downloadCSV);
    JSON.removeEventListener('click', downloadJSON);

    ResetFilter.addEventListener('click', resetFilters);
    ORtoggle.addEventListener('click', toggleFilter);
    CSV.addEventListener('click', downloadCSV);
    JSON.addEventListener('click', downloadJSON);
}


/**
 * Função que dá reset de qualquer filtro aplicado à tabela
 */
function resetFilters() {
    if (tablefinal) {
        cur_filter.innerText = "";
        tablefinal.clearHeaderFilter();
        tablefinal.clearFilter();
        counter = 0;
        filterMatrix = [];
    }
}

/**
 * 
 *Função que aplica o filtro OR à tabela
 */
function toggleFilter() {
    if (tablefinal) {
        headerFilters = tablefinal.getHeaderFilters();
        if (headerFilters.length == 0) return;
        filterMatrix[counter] = [];
        filterMatrix[counter] = headerFilters;
        counter++;
        tablefinal.clearHeaderFilter();
        tablefinal.clearFilter();
        cur_filter.innerText = formatString(generateFilterExpression(filterMatrix));
        tablefinal.setFilter(customFilter, generateFilterExpression(filterMatrix));
    }
}

/**
 * Função que realiza do download do conteudo da tabela em formato CSV
 */
function downloadCSV() {
    if (tablefinal) {
        //console.log("1");
        tablefinal.download("csv", "table.csv");
    }
}


/**
 * Função que realiza do download do conteudo da tabela em formato JSON
 */
function downloadJSON() {
    if (tablefinal) {
        //console.log("2");
        tablefinal.download("json", "table.json");
    }
}


var headerMenu = function () {
    var menu = [];
    var columns = this.getColumns();

    for (let column of columns) {

        //create checkbox element using font awesome icons
        let icon = document.createElement("i");
        icon.classList.add("fas");
        icon.classList.add(column.isVisible() ? "fa-check-square" : "fa-square");

        //build label
        let label = document.createElement("span");
        let title = document.createElement("span");

        title.textContent = " " + column.getDefinition().title;

        label.appendChild(icon);
        label.appendChild(title);

        //create menu item
        menu.push({
            label: label,
            action: function (e) {
                //prevent menu closing
                e.stopPropagation();

                //toggle current column visibility
                column.toggle();

                //change menu item icon
                if (column.isVisible()) {
                    icon.classList.remove("fa-square");
                    icon.classList.add("fa-check-square");
                } else {
                    icon.classList.remove("fa-check-square");
                    icon.classList.add("fa-square");
                }
            }
        });
    }

    return menu;
};

export { populateDropdown }