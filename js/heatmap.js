import { dataParseSalas, extractAttributes } from "./utils";
import { populateDropdown } from "./horario";
import { generateClassDuration } from "./suggestion";
import { isFunctionExpression } from "typescript";
import * as d3 from "d3";

var salas = [];
var datas = [];
var timestamps = [];
var matrix = [];

function setTimeStamps() {
    timestamps = generateClassDuration("08:00:00", "22:30:00");

}

function setMatrix(tabledata) {
    setTimeStamps();
    const parsedTableData = JSON.parse(tabledata);
    const dictionaryOriginal = {};
    //console.log(typeof datas[0]);
    parsedTableData.forEach(aula => {
        const key = aula["Data da aula"] + aula["Sala atribuída à aula"] + aula["Hora início da aula"];
        dictionaryOriginal[key] = aula;
    })

    for (let i = 0; i < timestamps.length; i++) {
        matrix.push([]);

        for (let j = 0; j < datas.length; j++) {
            var count = 0;
            salas.forEach(sala => {
                const key2 = datas[j] + sala + timestamps[i];

                if (key2 in dictionaryOriginal) {
                    count++;

                }

            });

            matrix[i].push(count);
        }
    }
    console.log(matrix);
    return matrix;
}

function salasSetter(salasPARAM) {
    salas = salasPARAM;
    console.log(salas);
}

function datasSetter(datasParam) {
    datas = datasParam;
    console.log(datas);
}

function createHeatMap(matrix) {
    // Assuming you have a 2D matrix


    let margin = { top: 50, right: 50, bottom: 50, left: 50 },
        width = 450 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    let svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let x = d3.scaleBand().range([0, width]).padding(0.1),  // Increase padding here
        y = d3.scaleBand().range([0, height]).padding(0.1), // and here
        z = d3.scaleSequential(d3.interpolateBlues);

    let rows = matrix.length;
    let cols = matrix[0].length;

    x.domain(d3.range(cols));
    y.domain(d3.range(rows));
    z.domain([0, d3.max(matrix, d => d3.max(d))]);

    svg.selectAll(".tile")
        .data(d3.merge(matrix.map((d, i) => d.map((v, j) => ({ x: j, y: i, value: v })))))
        .enter().append("rect")
        .attr("class", "tile")
        .attr("x", d => x(d.x))
        .attr("y", d => y(d.y))
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", d => z(d.value))
        .append("title")
        .text(d => `Value: ${d.value}`);


    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(function (d) { return datas[d]; }));

    // Add y-axis
    svg.append("g")
        .call(d3.axisLeft(y).tickFormat(function (d) { return timestamps[d]; }));

}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function handleGithubDataHeatmap(fileContent) {

    const tipoSalas = extractAttributes(fileContent);

    populateDropdown(tipoSalas, 'nomesSalasTEmp');

}



export { handleGithubDataHeatmap, salasSetter, datasSetter, setMatrix, createHeatMap };