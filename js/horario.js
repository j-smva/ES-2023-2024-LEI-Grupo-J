import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { dataParseHorario, dataParseSalas, extractAttributes, extractNomeSalas } from './utils';
import { generateFilterExpression, customFilter, formatString } from './filters';


import { addHeaderToDiv, addParagraphToDiv, createButton, createCheckboxes, createDateInputWithSubmit, createDiv, createDualSelect, createInput, createMultiSelect } from './htmlelems';
import { datasLength, generateClassDuration, generateSubClasses, generateTimeStamps, horasInicioLength, removeDuplicatesTimestamps, removeSalasFromList, removeSelectedWeekdaysFromMap, setAulaforSub, setDatas, setDatasBasedOnSub, setSalas, setSalasByType, setSingleDay, setWeekDays, timestampToMilliseconds } from './suggestion';
import dateCraft from 'date-craft';
import { turnToDate } from './calcSemanas';


var tablefinal; //tabela geral
var tabledata; // dados da tabela geral

var cur_filter; //filtro atual da tabela
var headerFilters; //filtros dos headerInputs
var filterMatrix = []; //matriz para o calculo dos filtros
var counter = 0; //contador para o calculo dos filtros

var aulaParaSubstituicao; //ter atenção se este é mesmon necessário
var divMain;
var dataSalas;
var nomeSalas = [];
var tipoSalas = [];

tablefinal = new Tabulator("#example-table", {
    pagination: "local",
    paginationSize: 10,
    paginationSizeSelector: [5, 10, 20, 40],
    paginationCounter: "rows",
    placeholder: "Awaiting Data, Please Load File",
});



document.addEventListener('DOMContentLoaded', function () {
    const githubButton = document.getElementById('githubButton');
    githubButton.addEventListener('click', gitHubCSVHorario);
    const githubButtonSalas = document.getElementById('githubButtonSalas');
    githubButtonSalas.addEventListener('click', function () {
        const githubLink = document.getElementById('githubLinkSalas').value;
        gitHubCSVSalas(1, githubLink);
    });
    const localButton = document.getElementById('localButton');
    localButton.addEventListener('change', function (event) {
        readLocalFile(event, 1);
    })
    const localButtonSalas = document.getElementById('localButtonSalas');
    localButtonSalas.addEventListener('change', function (event) {
        readLocalFile(event, 2);
    })
});

function tableOptionsStartup() {
    if (!divMain) {
        divMain = createDiv('Sub');
        //divMain.style.display = "block";
        divMain.style.display = "flex";
        divMain.style.flexDirection = "column";
        document.body.appendChild(divMain);
    } else {
        clearDiv(divMain);
    }
    const buttonSub = createButton('Substituir Aula', '', handleSubAula);
    addHeaderToDiv(1, "Opções", divMain);
    divMain.appendChild(buttonSub);
}

function clearDiv(div) {
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

function handleSubAula() {
    if (!tabledata) {
        alert('Horário não gerado');
    } else {
        const aulaSelected = tablefinal.getSelectedData();
        switch (aulaSelected.length) {
            case 0:
                alert('Aula não selecionada');
                break;
            case 1:
                //alert('tudo fixolas');
                aulaParaSubstituicao = aulaSelected[0];
                setAulaforSub(aulaParaSubstituicao);
                secondSalaSubmission(3, 2);
                break;
            default:
                alert('Selecionar apenas uma aula');
        }
    }
}

function secondSalaSubmission(numberLocal, numberGitHub) {
    clearDiv(divMain);
    const textInput = createInput('url', 'Enter Raw Link', '', null);
    divMain.appendChild(textInput);
    textInput.addEventListener('change', function () {
        // Call the gitHubCSVSalas function with the updated value of the input field
        gitHubCSVSalas(numberGitHub, textInput.value);
    });
    const fileInput = createInput('file', 'Enter File', '', null);
    divMain.appendChild(fileInput);
    fileInput.addEventListener('change', function (event) {
        // Call the gitHubCSVSalas function with the updated value of the input field
        readLocalFile(event, numberLocal);
    });
} //vai dar para reutilizar

function subAulaInfoSetter(content) {
    dataSalas = dataParseSalas(content);
    nomeSalas = extractNomeSalas(dataSalas);
    tipoSalas = extractAttributes(dataSalas);

    //console.log(dataSalas);
    //console.log(nomeSalas);
    //console.log(tipoSalas);
} //vai dar para reutilizar

function salasButtonsSetter() {
    clearDiv(divMain);
    const buttonAlocarSala = createButton('Alocar Sala(s) Específica', '', createOptionsAndBackButton, [nomeSalas, handleAllocateSalas, 'Alocar Sala']);
    divMain.appendChild(buttonAlocarSala);

    const buttonAlocarTipo = createButton('Alocar Tipo(s) de Sala Específico', '', createOptionsAndBackButton, [tipoSalas, handleAllocateTipo, 'Alocar Tipo(s) de Sala']);
    divMain.appendChild(buttonAlocarTipo);

    const buttonExludeSala = createButton('Excluir Sala(s) Especifica', '', createOptionsAndBackButton, [nomeSalas, handleExcludeSalas, 'Excluir Sala']);
    divMain.appendChild(buttonExludeSala);

    const buttonExcludeTipo = createButton('Excluir Tipo(s) de Sala Específco', '', createOptionsAndBackButton, [tipoSalas, handleExcludeTipo, 'Excluir Tipo(s) de sala']);
    divMain.appendChild(buttonExcludeTipo);

    const allsalas = createButton('Incluir Todas as Salas', '', handleAllSalas);
    divMain.appendChild(allsalas);
}

function handleAllSalas(){
    setSalas(nomeSalas);
    setAllocationOptions();
}

function createOptionsAndBackButton(options, handler, headerText) {
    clearDiv(divMain);
    addHeaderToDiv(1, headerText, divMain);
    const div = createMultiSelect(options, '', handler);
    divMain.appendChild(div);
    const goBackButton = createButton('Voltar a opções de Salas', '', salasButtonsSetter);
    divMain.appendChild(goBackButton);
}

function handleAllocateTipo(options) {
    if (options.length === 0) {
        alert('Nenhum Tipo de Sala selecionada');
    } else {
        setSalas(setSalasByType(dataSalas, options));
        setAllocationOptions();
    }
}

function handleAllocateSalas(options) {
    if (options.length === 0) {
        alert('Nenhuma Sala selecionada');
    } else {
        setSalas(options);
        setAllocationOptions();
    }
}

function handleExcludeSalas(options) {
    if (options.length === 0) {
        alert('Nenhuma Sala selecionada');
    } else {
        setSalas(nomeSalas);
        removeSalasFromList(options);
        setAllocationOptions();
    }

}

function handleExcludeTipo(options) {
    if (options.length === 0) {
        alert('Nenhum Tipo de Sala selecionada');
    } else {
        setSalas(nomeSalas);
        removeSalasFromList(setSalasByType(dataSalas, options));
        setAllocationOptions();
    }
}

function setAllocationOptions() {
    clearDiv(divMain);
    addHeaderToDiv(1, 'Opções de Alocação', divMain);
    const sameDay = createButton('Mesmo Dia', '', handleSameDay);
    const sameWeek = createButton('Mesma Semana', '', handleSameWeek);
    const betweenDates = createButton('Entre Datas', '', handleBetweenDates);
    const excludeOptions = createButton('Opções de Exclusão', '', handleExlusionOptions);
    divMain.appendChild(sameDay);
    divMain.appendChild(sameWeek);
    divMain.appendChild(betweenDates);
    divMain.appendChild(excludeOptions);
}

function handleSameDay() {
    setSingleDay();
    setExclusionOptions();
}

function handleSameWeek() {
    const weekIni = dateCraft.getStartOfWeek(turnToDate(aulaParaSubstituicao["Data da aula"]));
    const weekEnd = dateCraft.subtractDays(dateCraft.getEndOfWeek(turnToDate(aulaParaSubstituicao["Data da aula"])), 2);
    setDatas(weekIni, weekEnd);
    setExclusionOptions();
}

function handleBetweenDates() {
    clearDiv(divMain);
    addHeaderToDiv(1, 'Entre Datas', divMain);
    const datesInput = createDateInputWithSubmit('', handleBetweenDatesInput);
    divMain.appendChild(datesInput);
    const goBackButton = createButton('Voltar a opções de Alocação', '', setAllocationOptions);
    divMain.appendChild(goBackButton);
}

function handleBetweenDatesInput(inicio, fim) {
    //console.log(inicio);
    //console.log(fim);
    if (inicio && fim) {
        const ini = new Date(inicio);
        const end = new Date(fim);
        if (end > ini) {
            setDatas(ini, end);
            setExclusionOptions();
        } else {
            alert('Data de Inicio maior que Data de fim');
        }
    } else {
        alert('Submeter ambas as datas');
    }
}

function handleExlusionOptions() {
    setDatasBasedOnSub();
    setExclusionOptions();
}

function setExclusionOptions() {
    clearDiv(divMain);
    addHeaderToDiv(1, 'Opções de Exclusão (Horas)', divMain);
    const setPeriods = createButton('Períodos Predefinidos', '', handleSetPeriods);
    divMain.appendChild(setPeriods);
    const entreHoras = createButton('Entre Horas', '', handleEntreHoras);
    divMain.appendChild(entreHoras);
    const nenhum = createButton('Nenhum', '', callSetDays);
    divMain.appendChild(nenhum);
    const goBackButton = createButton('Voltar Atrás', '', setAllocationOptions);
    divMain.appendChild(goBackButton);

}


function handleSetPeriods() {
    clearDiv(divMain);
    addHeaderToDiv(1, 'Períodos Predefinidos para Horas de Início', divMain);
    addParagraphToDiv('Manhã: 08:00:00 - 12:30:00', divMain);
    addParagraphToDiv('Tarde: 13:00:00 - 18:30:00', divMain);
    addParagraphToDiv('Noite: 19:00:00 - 21:30:00', divMain);
    const option = createMultiSelect(['Manhã', 'Tarde', 'Noite'], '', handleSetPeriodsSelect);
    divMain.appendChild(option);
}

function handleSetPeriodsSelect(options) {
    generateTimeStamps();
    options.forEach(option => {
        switch (option) {
            case 'Manhã':
                removeDuplicatesTimestamps(generateClassDuration("08:00:00", "12:30:00"));
                break;
            case 'Tarde':
                removeDuplicatesTimestamps(generateClassDuration("13:00:00", "18:30:00"));
                break;
            case 'Noite':
                removeDuplicatesTimestamps(generateClassDuration("19:00:00", "21:30:00"));
                break;
        }
    });
    //console.log(horasInicioLength());
    if (horasInicioLength() === 0) {
        alert('Não é possivel remover todas as opções');
        handleSetPeriods();
    } else {
        if (datasLength() === 1) {
            setWeekDays();
            readyToShowSuggestion();
        } else {
            setDaysOfWeek();
        }
        //alert('tudo de boa');
    }
}

function handleEntreHoras() {
    clearDiv(divMain);
    addParagraphToDiv('Escolher Horas inicias e finais do período a excluir', divMain);
    const container = createDualSelect(generateClassDuration("08:00:00", "21:30:00"), '', handleEntreHorasSelection);
    divMain.appendChild(container);
}

function handleEntreHorasSelection(horaIni, horaEnd) {
    console.log(horaIni);
    console.log(horaEnd);
    console.log(timestampToMilliseconds(horaIni));
    console.log(timestampToMilliseconds(horaEnd));
    if (timestampToMilliseconds(horaIni) > timestampToMilliseconds(horaEnd)) {
        alert('Hora de fim maior do que hora de início');
    } else {
        generateTimeStamps();
        removeDuplicatesTimestamps(generateClassDuration(horaIni, horaEnd));
        if (datasLength() === 1) {
            setWeekDays();
            readyToShowSuggestion();
        } else {
            setDaysOfWeek();
        }
    }
}

function callSetDays(){
    generateTimeStamps();
    if (datasLength() === 1) {
        setWeekDays();
        readyToShowSuggestion();
    } else {
        setDaysOfWeek();
    }
}

function setDaysOfWeek() {
    clearDiv(divMain);
    addParagraphToDiv('Escolher Dias da Semana a excluir', divMain);
    const check = createCheckboxes(["Seg", "Ter", "Qua", "Qui", "Sex"], '', handleDaysOfWeekSelect);
    divMain.appendChild(check);
}

function handleDaysOfWeekSelect(selectedWeekDays) {
    console.log(selectedWeekDays);
    setWeekDays();
    removeSelectedWeekdaysFromMap(selectedWeekDays);
    readyToShowSuggestion();
}

function readyToShowSuggestion() {
    clearDiv(divMain);
    const generate = createButton('Gerar Sugestões', '', createTableSuggestion);
    divMain.appendChild(generate);
}

function createTableSuggestion() {
    clearDiv(divMain);
    const suggestion = createDiv('tabulator');
    suggestion.id = 'suggestion'
    divMain.appendChild(suggestion);
    const novatabledata = generateSubClasses(tabledata);
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
        footerElement: "<button id='Select'>Selecionar Aula Sub</button><button id='Reset'>Reset</button>",

    });
    tableS.on("tableBuilt", function () {
        const buttonSub = document.getElementById("Select");
        const button2 = document.getElementById("Reset");
        function handleClick() {
            const novaAula = tableS.getSelectedData();
            if (novaAula.length == 0) {
                alert('Nenhuma aula selecionada');
            } else {
                tablefinal.addRow(novaAula[0], true);
                const row = tablefinal.getSelectedRows();
                row[0].delete();
                //clearDiv(divMain);
                //divMain.remove();
                tableOptionsStartup();
            }
        }
        function reset(){
            tableOptionsStartup();
        }
        button2.removeEventListener('click',reset);
        button2.addEventListener('click',reset);
        buttonSub.removeEventListener('click', handleClick);
        buttonSub.addEventListener('click', handleClick);
    });
}


function gitHubCSVSalas(number, githubLink) {
    //numbers: 1 -> tabela Salas; 2->Substituir aula
    //const githubLink = document.getElementById('githubLinkSalas').value;
    fetch(githubLink)
        .then(response => response.text())
        .then(csvDataSalas => {
            switch (number) {
                case 1:
                    tabledata = dataParseSalas(csvDataSalas);
                    //console.log(tabledata);
                    createTableSalas(tabledata);
                    //console.log("isto funcionou a gerar tabela");
                    break;
                case 2:
                    //handleFileSub(csvDataSalas);
                    //alert('ta tudo fixolas');
                    subAulaInfoSetter(csvDataSalas);
                    salasButtonsSetter();
                    //console.log(dataParseSalas(csvDataSalas));
                    break;
            }
        })
        .catch(error => {
            console.error('Error fetching CSV data:', error);
        });
}

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
}

function readLocalFile(event, number) {
    //numbers: 1 -> Horario; 2 -> Salas;
    const file = event.target.files[0];

    if (file) {
        if (file.type === 'text/csv') {
            const reader = new FileReader();
            reader.onload = function (event) {
                const fileContent = event.target.result;
                switch (number) {
                    case 1:
                        tabledata = dataParseHorario(fileContent);
                        createTableHorario(tabledata);
                        break;
                    case 2:
                        tabledata = dataParseSalas(fileContent);
                        createTableSalas(tabledata);
                        break;
                    case 3:
                        //alert('ta tudo fixolas mas local');
                        subAulaInfoSetter(fileContent);
                        salasButtonsSetter();
                        //console.log(dataParseSalas(fileContent));
                        break;
                }

            }
            reader.readAsText(file);
        } else {
            console.error('Please select a CSV file.');
        }
    } else {
        console.error('No file selected.');
    }
}

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
        //console.log("adawdawda");
        // Set the background color of the newly added row to green
        row.getElement().style.backgroundColor = "green";
    });
}

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
}

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
    tableOptionsStartup();
}

function resetFilters() {
    if (tablefinal) {
        cur_filter.innerText = "";
        tablefinal.clearHeaderFilter();
        tablefinal.clearFilter();
        counter = 0;
        filterMatrix = [];
    }
}

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

function downloadCSV() {
    if (tablefinal) {
        //console.log("1");
        tablefinal.download("csv", "table.csv");
    }
}

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
}