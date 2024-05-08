import { dataParseSalas, extractAttributes } from "./utils";
import { populateDropdown } from "./horario";

var salas = [];

function salasSetter(salasPARAM) {
    salas = salasPARAM;
    console.log(salas);
}



function handleGithubDataHeatmap(fileContent) {

    const tipoSalas = extractAttributes(fileContent);

    populateDropdown(tipoSalas, 'nomesSalasTEmp');

}



export { handleGithubDataHeatmap, salasSetter };