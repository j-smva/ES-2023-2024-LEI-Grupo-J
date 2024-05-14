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
var graph;

/**
 * Função que define as aulas a serem consideradas para o gráfico de conflitualidade
 * @param {Array} aulasselected - Array com aulas 
 */
function setAulasGraph(aulasselected){
    aulas = [];
    aulas = aulasselected;
    console.log(aulas);
}

/**
 * Função que define as salas a serem consideradas pelo heatmap
 * @param {Array} salas - Array com salas
 */
function setSalasHeatmap(salas) {
    salasHeatmap = salas;
    console.log(salasHeatmap);
}

/**
 * Função que retorna o tamanho do vetor salas
 * @returns {Number} - Número de elementos no vetor salas
 */
function getSalasHeatMapLength() {
    return salasHeatmap.length;
}

/**
 * Função que define as horas a serem consideradas pelo heatmap
 */
function setHorasHeatmap() {
    horasHeatmap = generateClassDuration('08:00:00', '21:30:00');
}

/**
 * Função que define o período de tempo a ser considerado pelo heatmap
 * @param {String} start - Data inicial
 * @param {String} end - Data final
 */
function setDatasHeatmap(start, end) {
    datasHeatmap = [];
    datasHeatmap = getArrayDatesBetween(start, end);
    console.log(datasHeatmap);
}

/**
 * Função que retorna as salas com capacidade definida
 * @param {String} dataSalas - String com informação sobre as salas
 * @param {Number} capacidade - capacidade da sala 
 * @returns {Array} - Salas com a capacidade dada pelo argumento
 */
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

/**
 * Função que retorna as salas com número de características definida
 * @param {String} dataSalas - String com informação sobre as salas
 * @param {Number} numCarac - Número de características da sala
 * @returns {Array} - salas com número de características definido
 */
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

/**
 * Função que define a estrutura de dados lida pelo heatmap
 * @param {String} tabledata - String de dados da tabela
 */
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

/**
 * Função que desenha o heatmap
 */
function generateHeatMap() {
    chart = anychart.heatMap(heatmapData);
    chart.container('heatmap');
    chart.xScroller().enabled(true);
    chart.xZoom().setToPointsCount(8);
    chart.yScroller().enabled(true);
    chart.yZoom().setToPointsCount(8);
    chart.title("Mapa de ocupação de salas de aula.");
    chart.draw();
}

/**
 * Função que limpa o conteudo do heatmap
 */
function heatMapNull() {
    if (chart) {
        chart.dispose();
    }
}

/**
 * Função que devolve as aulas com determinado curso
 * @param {Array} tabledata - Array com aulas
 * @param {String} curso - Curso Escolhido
 * @returns {Array} - Aulas com curso selecionado
 */
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

/**
 * Função que devolve as aulas de determinada aula curricular
 * @param {Array} tabledata - Array com aulas
 * @param {String} uc - Unidade curricular escolhida
 * @returns {Array} - aulas com unidade curricular selecionada
 */
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

/**
 * Função que dado um array com datas remove todas as outras datas do array datasHeatMap
 * @param {Array} datesArray - Array com datas a filtrar
 * @returns {Array} - Datas Corretas
 */
function filterAulasByDates(datesArray) {
    const datesSet = new Set(datesArray);

    const filteredAulas = aulas.filter(aula => {
        const aulaDate = aula["Data da aula"];
        return datesSet.has(aulaDate);
    });

    return filteredAulas;
}

/**
 * Função que gera os dados para serem lidos pelo graph
 */
function generateData() {
    nodes = [];
    edges = [];

    for (let i = 0; i != aulas.length; i++) {
        const aux = aulas.slice(i + 1);
        const first = aulas[i];
        const firstkey = first["Data da aula"]+"  "+first["Sala atribuída à aula"]+"  "+first["Hora início da aula"];
        nodes.push({ id: firstkey });

        for (let j = 0; j != aux.length; j++)
            if (sameTime(first, aux[j]) && sameSala(first, aux[j]) && sameDate(first, aux[j])){
                const auxkey = aux[j]["Data da aula"]+"  "+aux[j]["Sala atribuída à aula"]+"  "+aux[j]["Hora início da aula"];
                edges.push({ from: firstkey, to: auxkey });
            }
    }

    console.log(nodes);
    console.log(edges);
}

/**
 * Função que retorna se duas aulas têm a mesma data
 * @param {Object} aula1 - aula para ser comparada
 * @param {Object} aula2 - aula para ser comparada
 * @returns {boolean}
 */
function sameDate(aula1, aula2) {
    return (aula1["Data da aula"] === aula2["Data da aula"]);
}

/**
 * Função que retorna se duas aulas têm a mesma sala
 * @param {Object} aula1 - aula para ser comparada
 * @param {Object} aula2 - aula para ser comparada
 * @returns {boolean}
 */
function sameSala(aula1, aula2) {
    return (aula1["Sala atribuída à aula"] === aula2["Sala atribuída à aula"]);
}

/**
 * Função que retorna se duas aulas ocorrem no mesmo intervalo de tempo
 * @param {Object} aula1 - aula para ser comparada
 * @param {Object} aula2 - aula para ser comparada
 * @returns {boolean}
 */
function sameTime(aula1, aula2) {
    return (aula1["Hora início da aula"] >= aula2["Hora início da aula"] && aula2["Hora início da aula"] < aula2["Hora fim da aula"]) ||
        (aula1["Hora fim da aula"] > aula2["Hora início da aula"] && aula1["Hora fim da aula"] <= aula2["Hora fim da aula"]);
}

/**
 * Função que gera o graph com todos os nodes e ligações
 */
function generateGraphDiagram() {
    const graphData = { nodes: nodes, edges: edges};
    console.log(graphData);
    graph = anychart.graph(graphData);
    graph.title("Gráfico de Colisões de Aulas");
    graph.container("graphdiagram");
    graph.draw();
}






export { filterAulasByDates,setAulasGraph ,heatMapNull, generateHeatMap, setHeatMapData, setDatasHeatmap, setSalasHeatmap, setSalasByCapacidade, setSalasByNumCaract, getSalasHeatMapLength, generateGraphDiagram, sameTime, sameSala, sameDate, generateData, getAulaByUc, getAulaByCurso };