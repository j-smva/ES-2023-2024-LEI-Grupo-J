import {TabulatorFull as Tabulator} from 'tabulator-tables';
import { generateFilterExpression, customFilter, formatString } from './filters';
import {dataParseHorario, dataParseSalas} from './utils';

//https://raw.githubusercontent.com/j-smva/ES-2023-2024-LEI-Grupo-J/main/CSVs/HorarioDeExemplo.csv

var table = new Tabulator("#example-table", {
    pagination: "local",
    paginationSize: 10,
    paginationSizeSelector: [5, 10, 20, 40],
    paginationCounter: "rows",
    placeholder:"Awaiting Data, Please Load File",
});

var tablefinal;
var headerFilters;
var filterMatrix = [];
var counter = 0;
var cur_filter;

document.addEventListener('DOMContentLoaded', function () {
    const githubButton = document.getElementById('githubButton');
    const localButton = document.getElementById('localButton');
    const githubButtonSalas = document.getElementById('githubButtonSalas');
    const localButtonSalas = document.getElementById('localButtonSalas');
    githubButtonSalas.addEventListener('click',gitHubCSVSalas);
    githubButton.addEventListener('click', gitHubCSVHorario);
    localButton.addEventListener('change', function(event) {
        // Get the selected file(s)
        const file = event.target.files[0];

        // Check if a file was selected
        if (file) {
            // Check if the selected file is a CSV file
            if (file.type === 'text/csv') {
                // Create a FileReader object
                const reader = new FileReader();

                // Set up event listener for when file reading is finished
                reader.onload = function(event) {
                    // event.target.result contains the contents of the file
                    const fileContent = event.target.result;
                    // Here you can process the CSV contents as needed
                    var tabledata = dataParseHorario(fileContent);
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
    localButtonSalas.addEventListener('change', function(event) {
        // Get the selected file(s)
        const file = event.target.files[0];

        // Check if a file was selected
        if (file) {
            // Check if the selected file is a CSV file
            if (file.type === 'text/csv') {
                // Create a FileReader object
                const reader = new FileReader();

                // Set up event listener for when file reading is finished
                reader.onload = function(event) {
                    // event.target.result contains the contents of the file
                    const fileContent = event.target.result;
                    // Here you can process the CSV contents as needed
                    var tabledata = dataParseSalas(fileContent);
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
});


function gitHubCSVHorario() {
    const githubLink = document.getElementById('githubLink').value;

    fetch(githubLink)
        .then(response => response.text())
        .then(csvData => {
            var tabledata = dataParseHorario(csvData);
            //console.log(tabledata);
            createTableHorario(tabledata);
        })
        .catch(error => {
            console.error('Error fetching CSV data:', error);
        });
};

function gitHubCSVSalas(){
    const githubLink = document.getElementById('githubLinkSalas').value;
    fetch(githubLink)
        .then(response => response.text())
        .then(csvDataSalas => {
            var tabledata = dataParseSalas(csvDataSalas);
            //console.log(tabledata);
            createTableSalas(tabledata);

        })
        .catch(error => {
            console.error('Error fetching CSV data:', error);
        });
};




function createTableHorario(tabledata){

    tablefinal = new Tabulator("#example-table", {
        layout: "fitColumns",
        data:tabledata,
        pagination: "local",
        paginationSize: 10,
        paginationSizeSelector: [5, 10, 20, 40],
        movableColumns: false,
        paginationCounter: "rows",
        footerElement:"<button id='ORtoggle'>OR Filter Toggle</button><button id='ResetFilter'>Reset Filters</button>",
        columns:[
            {title:"Curso", field:"Curso", headerFilter:"input", headerMenu:headerMenu},
            {title:"Unidade Curricular", field:"Unidade Curricular", headerFilter:"input", headerMenu:headerMenu},
            {title:"Turno", field:"Turno", headerFilter:"input", headerMenu:headerMenu},
            {title:"Turma", field:"Turma", headerFilter:"input", headerMenu:headerMenu},
            {title:"Inscritos no Turno", field:"Inscritos no turno", headerFilter:"input", headerMenu:headerMenu},
            {title:"Dia da Semana", field:"Dia da semana", headerFilter:"input", headerMenu:headerMenu},
            {title:"Hora início da aula", field:"Hora início da aula", headerFilter:"input", headerMenu:headerMenu},
            {title:"Hora fim da aula", field:"Hora fim da aula", headerFilter:"input", headerMenu:headerMenu},
            {title:"Data da aula", field:"Data da aula", headerFilter:"input", headerMenu:headerMenu},
            {title:"Características da sala pedida para a aula", field:"Características da sala pedida para a aula", headerFilter:"input", headerMenu:headerMenu},
            {title:"Sala atribuída à aula", field:"Sala atribuída à aula", headerFilter:"input", headerMenu:headerMenu},
            {title:"Semana do Ano", field:"Semana do Ano", headerFilter:"input", headerMenu:headerMenu},
            {title:"Semana do Semestre", field:"Semana do Semestre", headerFilter:"input", headerMenu:headerMenu},
        ],
    });
    tablefinal.on("tableBuilt", addEventListeners);  
}


function createTableSalas(tabledata){
    
    tablefinal = new Tabulator("#example-table", {
        layout: "fitData",
        data:tabledata,
        pagination: "local",
        paginationSize: 10,
        paginationSizeSelector: [5, 10, 20, 40],
        movableColumns: false,
        //autoColumns:true,
        paginationCounter: "rows",
        footerElement:"<button id='ORtoggle'>OR Filter Toggle</button><button id='ResetFilter'>Reset Filters</button>",
        columns:[
            {title:"Edifício", field:"Edifício", headerFilter:"input", headerMenu:headerMenu},
            {title:"Nome sala", field:"Nome sala", headerFilter:"input", headerMenu:headerMenu},
            {title:"Capacidade Normal", field:"Capacidade Normal", headerFilter:"input", headerMenu:headerMenu},
            {title:"Capacidade Exame", field:"Capacidade Exame", headerFilter:"input", headerMenu:headerMenu},
            {title:"Nº características", field:"Nº características", headerFilter:"input", headerMenu:headerMenu},
            {title:"Anfiteatro aulas", field:"Anfiteatro aulas", headerFilter:"input", headerMenu:headerMenu},
            {title:"Apoio técnico eventos", field:"Apoio técnico eventos", headerFilter:"input", headerMenu:headerMenu},
            {title:"Arq 1", field:"Arq 1", headerFilter:"input", headerMenu:headerMenu},
            {title:"Arq 2", field:"Arq 2", headerFilter:"input", headerMenu:headerMenu},
            {title:"Arq 3", field:"Arq 3", headerFilter:"input", headerMenu:headerMenu},
            {title:"Arq 4", field:"Arq 4", headerFilter:"input", headerMenu:headerMenu},
            {title:"Arq 5", field:"Arq 5", headerFilter:"input", headerMenu:headerMenu},
            {title:"Arq 6", field:"Arq 6", headerFilter:"input", headerMenu:headerMenu},
            {title:"Arq 9", field:"Arq 9", headerFilter:"input", headerMenu:headerMenu},
            {title:"BYOD (Bring Your Own Device)", field:"BYOD (Bring Your Own Device)", headerFilter:"input", headerMenu:headerMenu},
            {title:"Focus Group", field:"Focus Group", headerFilter:"input", headerMenu:headerMenu},
            {title:"Horário sala visível portal público", field:"Horário sala visível portal público", headerFilter:"input", headerMenu:headerMenu},
            {title:"Laboratório de Arquitectura de Computadores I", field:"Laboratório de Arquitectura de Computadores I", headerFilter:"input", headerMenu:headerMenu},
            {title:"Laboratório de Arquitectura de Computadores II", field:"Laboratório de Arquitectura de Computadores II", headerFilter:"input", headerMenu:headerMenu},
            {title:"Laboratório de Bases de Engenharia", field:"Laboratório de Bases de Engenharia", headerFilter:"input", headerMenu:headerMenu},
            {title:"Laboratório de Electrónica", field:"Laboratório de Electrónica", headerFilter:"input", headerMenu:headerMenu},
            {title:"Laboratório de Informática", field:"Laboratório de Informática", headerFilter:"input", headerMenu:headerMenu},
            {title:"Laboratório de Jornalismo", field:"Laboratório de Jornalismo", headerFilter:"input", headerMenu:headerMenu},
            {title:"Laboratório de Redes de Computadores I", field:"Laboratório de Redes de Computadores I", headerFilter:"input", headerMenu:headerMenu},
            {title:"Laboratório de Redes de Computadores II", field:"Laboratório de Redes de Computadores II", headerFilter:"input", headerMenu:headerMenu},
            {title:"Laboratório de Telecomunicações", field:"Laboratório de Telecomunicações", headerFilter:"input", headerMenu:headerMenu},
            {title:"Sala Aulas Mestrado", field:"Sala Aulas Mestrado", headerFilter:"input", headerMenu:headerMenu},
            {title:"Sala Aulas Mestrado Plus", field:"Sala Aulas Mestrado Plus", headerFilter:"input", headerMenu:headerMenu},
            {title:"Sala NEE", field:"Sala NEE", headerFilter:"input", headerMenu:headerMenu},
            {title:"Sala Provas", field:"Sala Provas", headerFilter:"input", headerMenu:headerMenu},
            {title:"Sala Reunião", field:"Sala Reunião", headerFilter:"input", headerMenu:headerMenu},
            {title:"Sala de Arquitectura", field:"Sala de Arquitectura", headerFilter:"input", headerMenu:headerMenu},
            {title:"Videoconferência", field:"videoconferência", headerFilter:"input", headerMenu:headerMenu},
            {title:"Átrio", field:"átrio", headerFilter:"input", headerMenu:headerMenu},
        ],
    });

    tablefinal.on("tableBuilt", addEventListeners);  

};

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

var headerMenu = function(){
    var menu = [];
    var columns = this.getColumns();

    for(let column of columns){

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
            label:label,
            action:function(e){
                //prevent menu closing
                e.stopPropagation();

                //toggle current column visibility
                column.toggle();

                //change menu item icon
                if(column.isVisible()){
                    icon.classList.remove("fa-square");
                    icon.classList.add("fa-check-square");
                }else{
                    icon.classList.remove("fa-check-square");
                    icon.classList.add("fa-square");
                }
            }
        });
    }

   return menu;
};