
import { Tabulator } from 'tabulator-tables';
import { giveSemanaAno, giveSemanaSemestre } from './calcSemanas';


/**
 * Data Parse Salas
 * @param {String} csvDataSalas - Conteudo do ficheiro CSV acerca das salas
 * @returns {String} - Conteudo do ficheiro CSV em formato JSON
 */
function dataParseSalas(csvDataSalas){
    const data = fixTextLocal(csvDataSalas);
    //console.log(data);
    const lines = data.split('\n');
    const headers = lines[0].split(';');
    headers[headers.length -1] = headers[headers.length -1].replace(/\r/g, '');
    //console.log(headers);
    const jsonArray = [];
    for(let i = 1; i < lines.length; i++){
        const values = lines[i].split(';');
        const jsonObj = {};
        for(let j = 0; j < headers.length; j++){
            jsonObj[headers[j]] = values[j];
        }
        jsonArray.push(jsonObj);
    }
    return JSON.stringify(jsonArray);
}


/**
 * Data Parse Horario
 * @param {String} csvData - Conteudo do ficheiro CSV acerca do horário
 * @returns {String} - Conteudo do ficheiro CSV em formato JSON
 */
function dataParseHorario(csvData){ //não usa tabulator
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


/**
 * Fix Text
 * @param {String} csvDataSalas - Conteudo do ficheiro CSV acerca das salas
 * @returns {String} - Conteudo do ficheiro CSV acerca das salas com texto devidamente corrigido
 */
function fixTextLocal(csvDataSalas){
    const fixedText = csvDataSalas
        .replace(/’/g, 'í')
        .replace(/¼/g, 'º')
        .replace(/Ž/g, 'é')
        .replace(/‡/g, 'á')
        .replace(/œ/g, 'ú')
        .replace(/—/g, 'ó')
        .replace(/videoconferncia/g, 'ê')
        .replace(/çtrio/g, 'átrio')
        .replace(/Reuni‹o/g, 'Reunião')
        .replace(/Balc‹o/g, 'Balcão')
        .replace(/Recep‹o/g, 'Recepção')
        .replace(/Edif�cio/g, 'Edifício')
        .replace(/N� caracter�sticas/g, 'Nº características')
        .replace(/t�cnico/g, 'técnico')
        .replace(/Hor�rio/g, 'Horário')
        .replace(/vis�vel/g, 'visível')
        .replace(/p�blico/g, 'público')
        .replace(/Laborat�rio/g, 'Laboratório')
        .replace(/Electr�nica/g, 'Electrónica')
        .replace(/Inform�tica/g, 'Informática')
        .replace(/Telecomunica��es/g, 'Telecomunicações')
        .replace(/Reuni�o/g, 'Reunião')
        .replace(/videoconfer�ncia/g, 'videoconferência')
        .replace(/�trio/g, 'átrio')
        .replace(/M�rio/g, 'Mário')
        .replace(/Aut�noma/g, 'Autónoma')
        .replace(/Audit�rio/g, 'Auditório')
        .replace(/Espa�o Exposi��es/g, 'Espaço Exposições')
        .replace(/Balc�o Recep��o/g, 'Balcão Recepção')
        .replace(/Balne�rio/g, 'Balneário')
        .replace(/Telecomunica›es/g, 'Telecomunicações');

    return fixedText;

};

/**
 * Função que extrai o nome de todas as salas da informação sobre as salas fornecida pelo utilizador
 * @param {String} jsonString - Informação sobre as salas
 * @returns {Array<String>} - Array com o nome de todas as salas existentes no ficheiro
 */
function extractNomeSalas(jsonString) {
    // Parse the JSON string into a JavaScript object
    let jsonData = [];
    try {
        jsonData = JSON.parse(jsonString);
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return []; // Return an empty array if parsing fails
    }

    // Initialize an empty array to store the "Nome Sala" values
    const nomeSalasArray = [];

    // Check if the jsonData is an array
    if (Array.isArray(jsonData)) {
        // Loop through each entry in the JSON data
        jsonData.forEach(function(entry) {
            // Check if the current entry has the "Nome sala" property
            if (entry && entry["Nome sala"]) {
                // Add the "Nome Sala" value to the array
                nomeSalasArray.push(entry["Nome sala"]);
            }
        });
    } else {
        console.error("Input data is not an array.");
    }

    // Return the array containing "Nome Sala" values
    return nomeSalasArray;
}

/**
 * Função que filtra certas chaves do horário ou cadastro de salas
 * @param {String} jsonString - dados do horário ou salas
 * @param {String} attributeName - nome da chave a filtrar
 * @returns {Array} - Atributos desejados
 */
function extractAttributeValues(jsonString, attributeName) {
    // Parse the JSON string into a JavaScript object
    let jsonData = [];
    try {
        jsonData = JSON.parse(jsonString);
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return []; // Return an empty array if parsing fails
    }

    // Initialize an empty Set to store unique attribute values
    const attributeValuesSet = new Set();

    // Check if the jsonData is an array
    if (Array.isArray(jsonData)) {
        // Loop through each entry in the JSON data
        jsonData.forEach(function(entry) {
            // Check if the current entry has the specified attribute
            if (entry && entry[attributeName]) {
                // Add the attribute value to the Set
                attributeValuesSet.add(entry[attributeName]);
            }
        });
    } else {
        console.error("Input data is not an array.");
    }

    // Convert the Set to an array and return
    return Array.from(attributeValuesSet);
}

/**
 * Função que extrai o nome de todos as unidade curriculares presentes na tabela
 * @param {Array} tabledata - dados da tabela de onde serão extraidos os nomes das UCs
 * @returns {Map} - Mapa com os nomes de todas as UCs
 */
function getUCs(tabledata) {
    const uniqueValues = {};
    tabledata.forEach(function(row) {
        const columnValue = row["Unidade Curricular"];
        if (!uniqueValues[columnValue]) {
            uniqueValues[columnValue] = true;
        }
    });

    const uniqueEntries = Object.keys(uniqueValues);
    console.log(uniqueEntries);
    return uniqueEntries;
}

/**
 * Função que extrai o nome de todos os cursos presentes na tabela
 * @param {Array} tabledata - dados da tabela de onde serão extraídos os nomes dos Cursos
 * @returns {Map} - Mapa com os nomes de todos os Cursos
 */
function getCursos(tabledata) {
    const uniqueValues = {};
    tabledata.forEach(function(row) {
        const columnValue = row["Curso"].split(', ');
        columnValue.forEach(function(entrie){
            if (!uniqueValues[entrie]) {
                uniqueValues[entrie] = true;
            }
        })
    });

    const uniqueEntries = Object.keys(uniqueValues);
    console.log(uniqueEntries);
    return uniqueEntries;
}

/**
 * Função que extrai o nome de todas as turmas presentes na tabela
 * @param {Array} tabledata - dados da tabela de onde serão extraidos os nomes das turmas
 * @returns {Map} - Mapa com os nomes de todas as turmas
 */
function getTurmas(tabledata) {
    const uniqueValues = {};
    tabledata.forEach(function(row) {
        const columnValue = row["Turma"].split(', ');
        columnValue.forEach(function(entrie){
            if (!uniqueValues[entrie]) {
                uniqueValues[entrie] = true;
            }
        })
    });

    var uniqueEntries = Object.keys(uniqueValues);
    return uniqueEntries;
}

/**
 * Função que extrai todos os tipos de salas existentes no ficheiro
 * @param {String} jsonString - Informação sobre as salas
 * @returns {Array<String>} - Array com todos os tipos de salas
 */
function extractAttributes(jsonString) {
    // Parse the JSON string into a JavaScript object
    let jsonData = [];
    try {
        jsonData = JSON.parse(jsonString);
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return []; // Return an empty array if parsing fails
    }

    // Array of keys within the desired range of attributes
    var desiredKeys = [
        "Anfiteatro aulas",
        "Apoio técnico eventos",
        "Arq 1",
        "Arq 2",
        "Arq 3",
        "Arq 4",
        "Arq 5",
        "Arq 6",
        "Arq 9",
        "BYOD (Bring Your Own Device)",
        "Focus Group",
        "Horário sala visível portal público",
        "Laboratório de Arquitectura de Computadores I",
        "Laboratório de Arquitectura de Computadores II",
        "Laboratório de Bases de Engenharia",
        "Laboratório de Electrónica",
        "Laboratório de Informática",
        "Laboratório de Jornalismo",
        "Laboratório de Redes de Computadores I",
        "Laboratório de Redes de Computadores II",
        "Laboratório de Telecomunicações",
        "Sala Aulas Mestrado",
        "Sala Aulas Mestrado Plus",
        "Sala NEE",
        "Sala Provas",
        "Sala Reunião",
        "Sala de Arquitectura",
        "Sala de Aulas normal",
        "videoconferência",
        "átrio"
    ];

    // Check if the parsed JSON object is not null and is an object
    if (jsonData[0] !== null && typeof jsonData[0] === 'object') {
        // Initialize an empty array to store the attribute names
        const attributesArray = [];

        // Loop through each key in the JSON object
        for (var key in jsonData[0]) {
            // Check if the key is within the desired range of attributes
            if (desiredKeys.includes(key)) {
                // Add the key (attribute name) to the array
                attributesArray.push(key);
            }
        }

        // Return the array containing attribute names
        return attributesArray;
    } else {
        console.error("Input data is not a valid JSON object.");
        return []; // Return an empty array if input is not a valid JSON object
    }
}

export { extractAttributeValues,dataParseHorario, dataParseSalas, fixTextLocal, extractNomeSalas, extractAttributes, getUCs, getCursos, getTurmas};