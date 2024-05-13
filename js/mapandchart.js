import anychart from 'anychart';
import { generateClassDuration } from './suggestion';
import { getArrayDatesBetween } from './calcSemanas';




var horasHeatmap = [];
var salasHeatmap = [];
var datasHeatmap = [];
var heatmapData = [];
var chart;

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
    console.log(dictionaryOriginal);
    console.log(datasHeatmap);
    console.log(horasHeatmap);
    console.log(salasHeatmap);

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
                        console.log('olá entrei aqui');
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

function heatMapNull(){
    if(chart){
        chart.dispose();
    }
}








export { heatMapNull ,generateHeatMap, setHeatMapData, setDatasHeatmap, setSalasHeatmap, setSalasByCapacidade, setSalasByNumCaract, getSalasHeatMapLength };