import {TabulatorFull as Tabulator} from 'tabulator-tables';
import { giveSemanaAno, giveSemanaSemestre } from './calcSemanas';


//https://raw.githubusercontent.com/j-smva/ES-2023-2024-LEI-Grupo-J/main/CSVs/HorarioDeExemplo.csv

var table = new Tabulator("#example-table", {
    pagination: "local",
    paginationSize: 10,
    paginationSizeSelector: [5, 10, 20, 40],
    paginationCounter: "rows",
    placeholder:"Awaiting Data, Please Load File",
});
var tablefinal = null;

document.addEventListener('DOMContentLoaded', function () {
    const githubButton = document.getElementById('githubButton');
    const localButton = document.getElementById('localButton');
    githubButton.addEventListener('click', gitHubCSV);
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
                    var tabledata = dataParse(fileContent);
                    //console.log(tabledata);
                    createTable(tabledata);
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


function gitHubCSV() {
    const githubLink = document.getElementById('githubLink').value;

    fetch(githubLink)
        .then(response => response.text())
        .then(csvData => {
            var tabledata = dataParse(csvData);
            //console.log(tabledata);
            createTable(tabledata);
        })
        .catch(error => {
            console.error('Error fetching CSV data:', error);
        });
}


function dataParse(csvData){ //experimentar switch case mais tarde
    const lines = csvData.split('\n');
    const headers = lines[0].split(';');
    headers.push("Semana do Ano", "Semana do Semestre");
    const jsonArray = [];
    for(let i = 1; i < lines.length; i++){
        const values = lines[i].split(';');
        const jsonObj = {};
        for(let j = 0; j < headers.length - 2; j++){
            if(headers[j].includes("Data")){
                jsonObj[headers[j]] = values[j];
                const semanaAno = giveSemanaAno(values[j]);
                const semanaSemestre = giveSemanaSemestre(values[j]);
                jsonObj[headers[headers.length - 2]] = semanaAno;
                jsonObj[headers[headers.length - 1]] = semanaSemestre;
            } else if(headers[j].includes("atribuída")){
                values[j] = values[j].replace(/\r/g, '');
                headers[j] = headers[j].replace(/\r/g, '');
                jsonObj[headers[j]] = values[j];
            } else {
                jsonObj[headers[j]] = values[j];
            }
        }
        jsonArray.push(jsonObj);
    }
    return JSON.stringify(jsonArray);

}



function createTable(tabledata){
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
    }

    var tablefinal = new Tabulator("#example-table", {
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

    var filterMatrix = [];
    var counter = 0;

    tablefinal.on("tableBuilt",function(){
        const ORtoggle = document.getElementById('ORtoggle');
        const ResetFilter = document.getElementById('ResetFilter');
        const cur_filter = document.getElementById('cur_filter');

        ResetFilter.addEventListener('click', function(){
            tablefinal.clearHeaderFilter();
            tablefinal.clearFilter();
            counter = 0;
            filterMatrix = [];
        })

        ORtoggle.addEventListener('click',function(){
            var headerFilters = tablefinal.getHeaderFilters();
            filterMatrix[counter]=[];
            filterMatrix[counter]=headerFilters;
            counter++;
            tablefinal.clearHeaderFilter();
            tablefinal.clearFilter();
            tablefinal.setFilter(customFilter,generateFilterExpression(filterMatrix));
        })
    }); 

function generateFilterExpression(dataArray) {
    let expression = "(";
    for (let i = 0; i < dataArray.length; i++) {
        let subArray = dataArray[i];
        expression += "(";
        for (let j = 0; j < subArray.length; j++) {
            let filterObject = subArray[j];
            expression += `data["${filterObject.field}"] ${filterObject.type} "${filterObject.value}"`;
            if (j < subArray.length - 1) {
                expression += " && ";
            }
        }
        expression += ")";
        if (i < dataArray.length - 1) {
            expression += " || ";
        }
    }
    expression += ")";
    return expression.replace(/like/g, "==");
}

function customFilter(data,str){
    cur_filter.innerText =formatString(str);
    return eval(str);
}

function formatString(input) {
    let formattedString = input.replace(/\(/, ''); // Remove the first opening parenthesis
    formattedString = formattedString.replace(/\)$/, ''); // Remove the last closing parenthesis
    formattedString = formattedString.replace(/==/g, ' é '); // Replace "==" with " é "
    formattedString = formattedString.replace(/data\["/g, ''); // Remove "data["
    formattedString = formattedString.replace(/"\] /g, ''); // Remove "] "
    formattedString = formattedString.replace(/&&/g, ' e '); // Replace "&&" with " e "
    formattedString = formattedString.replace(/\|\|/g, ' ou '); // Replace "||" with " ou "
    
    return formattedString;
}

};