import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { dataParseHorario, dataParseSalas } from './utils';
import { generateFilterExpression, customFilter, formatString } from './filters';


import { createButton } from './htmlelems';


var tablefinal;
var tabledata;
var cur_filter;
var headerFilters;
var filterMatrix = [];
var counter = 0;
    
tablefinal = new Tabulator("#example-table", {
    pagination: "local",
    paginationSize: 10,
    paginationSizeSelector: [5, 10, 20, 40],
    paginationCounter: "rows",
    placeholder: "Awaiting Data, Please Load File",
});



document.addEventListener('DOMContentLoaded', function(){
    const githubButton = document.getElementById('githubButton');
    githubButton.addEventListener('click', gitHubCSVHorario);
    const githubButtonSalas = document.getElementById('githubButtonSalas');
    githubButtonSalas.addEventListener('click', function () {
        const githubLink = document.getElementById('githubLinkSalas').value;
        gitHubCSVSalas(1, githubLink);
    });
    const localButton = document.getElementById('localButton');
    localButton.addEventListener('change', function(event){
        readLocalFile(event,1);
    })
    const localButtonSalas = document.getElementById('localButtonSalas');
    localButtonSalas.addEventListener('change', function(event){
        readLocalFile(event,2);
    })
});

function gitHubCSVSalas(number, githubLink) {
    //numbers: 1 -> tabela Salas;
    //const githubLink = document.getElementById('githubLinkSalas').value;
    fetch(githubLink)
        .then(response => response.text())
        .then(csvDataSalas => {
            if (number == 1) {
                tabledata = dataParseSalas(csvDataSalas);
                //console.log(tabledata);
                createTableSalas(tabledata);
                //console.log("isto funcionou a gerar tabela");
            } else if (number == 2) {
                handleFileSub(csvDataSalas);
            } else if (number == 3) {
                handleFileUCS(csvDataSalas)
            }


        })
        .catch(error => {
            console.error('Error fetching CSV data:', error);
        });
};

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

function readLocalFile(event, number){
    //numbers: 1 -> Horario; 2 -> Salas;
    const file = event.target.files[0];

    if(file){
        if(file.type === 'text/csv'){
            const reader = new FileReader();
            reader.onload = function (event){
                const fileContent = event.target.result;
                switch(number) {
                    case 1:
                        tabledata = dataParseHorario(fileContent);
                        createTableHorario(tabledata);
                        break;
                    case 2:
                        tabledata = dataParseSalas(fileContent);
                        createTableSalas(tabledata);
                        
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

function createTableSalas(tabledata){
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
};