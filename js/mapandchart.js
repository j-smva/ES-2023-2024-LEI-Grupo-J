import anychart from 'anychart';
import { generateClassDuration } from './suggestion';
import { getArrayDatesBetween } from './calcSemanas';




var horasHeatmap = [];
var salasHeatmap = [];
var datasHeatmap = [];
var heatmapData = [];
var chart;

var aulas = [];
var nodes = [];
var edges = [];
// var cursosGraph = [];
// var ucsGraph = [];
var graph;

function setAulasGraph(aulasselected){
    aulas = [];
    aulas = aulasselected;
    console.log(aulas);
}

function setSalasHeatmap(salas) {
    salasHeatmap = salas;
    console.log(salasHeatmap);
}


function getSalasHeatMapLength() {
    return salasHeatmap.length;
}

function setHorasHeatmap() {
    horasHeatmap = generateClassDuration('08:00:00', '21:30:00');
}

function setDatasHeatmap(start, end) {
    datasHeatmap = [];
    datasHeatmap = getArrayDatesBetween(start, end);
    console.log(datasHeatmap);
}


function setSalasByCapacidade(dataSalas, capacidade) {
    const salasOfType = new Set();
    const data = JSON.parse(dataSalas);
    data.forEach(obj => {
        if (obj["Capacidade Normal"] == capacidade) {
            salasOfType.add(obj["Nome sala"]);
        }
    });
    return Array.from(salasOfType);
}

function setSalasByNumCaract(dataSalas, numCarac) {
    const salasOfType = new Set();
    const data = JSON.parse(dataSalas);
    data.forEach(obj => {
        if (obj["Nº características"] == numCarac) {
            salasOfType.add(obj["Nome sala"]);
        }
    });
    return Array.from(salasOfType);
}


function setHeatMapData(tabledata) {
    heatmapData = [];
    setHorasHeatmap();
    const dictionaryOriginal = {};
    const parsedTableData = JSON.parse(tabledata);
    parsedTableData.forEach(aula => {
        const key = aula["Data da aula"] + aula["Sala atribuída à aula"];
        const value = generateClassDuration(aula["Hora início da aula"], aula["Hora fim da aula"]);
        if (!(key in dictionaryOriginal)) {
            dictionaryOriginal[key] = [];
        }

        dictionaryOriginal[key].push(value);
    })
    //console.log(dictionaryOriginal);
    //console.log(datasHeatmap);
    //console.log(horasHeatmap);
    //console.log(salasHeatmap);

    datasHeatmap.forEach(data => {
        horasHeatmap.forEach(hora => {
            let ocupadas = 0;
            salasHeatmap.forEach(sala => {
                const key2 = data + sala;
                console.log(key2);
                if (dictionaryOriginal.hasOwnProperty(key2)) {
                    console.log('Checking key2:', key2);
                    console.log('Hora:', hora);
                    console.log('Items in dictionary:', dictionaryOriginal[key2]);
                    if (dictionaryOriginal[key2].some(item => item.includes(hora))) {
                        //console.log('olá entrei aqui');
                        ocupadas++;
                    }
                }
            })
            heatmapData.push({ x: data, y: hora, heat: ocupadas });
            console.log(heatmapData);
        })
    })

    console.log(heatmapData);
}


function generateHeatMap() {
    chart = anychart.heatMap(heatmapData);
    chart.container('heatmap');
    chart.xScroller().enabled(true);
    chart.xZoom().setToPointsCount(8);
    chart.yScroller().enabled(true);
    chart.yZoom().setToPointsCount(8);
    chart.draw();
}

function heatMapNull() {
    if (chart) {
        chart.dispose();
    }
}

function getAulaByCurso(tabledata, curso) {
    const aulas = new Set();
    //const data = JSON.parse(tabledata);
    tabledata.forEach(obj => {
        if (obj["Curso"] == curso) {
            aulas.add(obj);
        }
    });
    return Array.from(aulas);
}

function getAulaByUc(tabledata, uc) {
    const aulas = new Set();
    //const data = JSON.parse(tabledata);
    tabledata.forEach(obj => {
        if (obj["Unidade Curricular"] == uc) {
            aulas.add(obj);
        }
    });
    return Array.from(aulas);
}

function filterAulasByDates(datesArray) {
    // Convert datesArray to a Set for faster lookup
    const datesSet = new Set(datesArray);

    // Filter aulas array to keep only the elements with dates not present in datesArray
    const filteredAulas = aulas.filter(aula => {
        // Extract the "Data da aula" field from the aula object
        const aulaDate = aula["Data da aula"];

        // Check if the aulaDate is not in datesSet
        return datesSet.has(aulaDate);
    });

    return filteredAulas;
}

function generateData() {
    nodes = [];
    edges = [];

    for (let i = 0; i != aulas.length; i++) {
        const aux = aulas.slice(i + 1);
        const first = aulas[i];
        const firstkey = first["Data da aula"]+first["Sala atribuída à aula"]+first["Hora início da aula"];
        nodes.push({ id: firstkey });

        for (let j = 0; j != aux.length; j++)
            if (sameTime(first, aux[j]) && sameSala(first, aux[j]) && sameDate(first, aux[j])){
                const auxkey = aux[j]["Data da aula"]+aux[j]["Sala atribuída à aula"]+aux[j]["Hora início da aula"];
                edges.push({ from: firstkey, to: auxkey });
            }
    }

    console.log(nodes);
    console.log(edges);
}

function sameDate(aula1, aula2) {
    return (aula1["Data da aula"] === aula2["Data da aula"]);
}

function sameSala(aula1, aula2) {
    return (aula1["Sala atribuída à aula"] === aula2["Sala atribuída à aula"]);
}

function sameTime(aula1, aula2) {
    return (aula1["Hora início da aula"] >= aula2["Hora início da aula"] && aula2["Hora início da aula"] < aula2["Hora fim da aula"]) ||
        (aula1["Hora fim da aula"] > aula2["Hora início da aula"] && aula1["Hora fim da aula"] <= aula2["Hora fim da aula"]);
}

function generateGraphDiagram() {
    const graphData = { nodes: nodes, edges: edges};
    console.log(graphData);
    graph = anychart.graph(graphData);
    graph.title("Gráfico de Colisões de Aulas");
    graph.container("graphdiagram");
    graph.draw();
}






export { filterAulasByDates,setAulasGraph ,heatMapNull, generateHeatMap, setHeatMapData, setDatasHeatmap, setSalasHeatmap, setSalasByCapacidade, setSalasByNumCaract, getSalasHeatMapLength, generateGraphDiagram, sameTime, sameSala, sameDate, generateData, getAulaByUc, getAulaByCurso };