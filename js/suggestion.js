import dateCraft from 'date-craft';
import { getArrayDatesBetween, turnToDate, giveSemanaAno, giveSemanaSemestre } from './calcSemanas';

//variáveis necessárias para o algoritmo 
var aulaForSub; //aula que foi selecionada para ser substituida
var weekDays; //pares de chave valor com números e dias da semana baseados nos resultados da função .getDay() da classe DATE
var salasAula = []; // array que recebe as salas de aula.
var horasInicio = []; //array que recebe as horas possiveis de inicio de uma sala.
var datas = []; //array que guarda todas as datas em que é possivel marcar as aulas; 
var aulas; //quantos aulas para marcar

//função que dá set a todos os dias da semana e a sua chave.
function setWeekDays(){
    weekDays = {
        1: "Seg",
        2: "Ter",
        3: "Qua",
        4: "Qui",
        5: "Sex"
      };
    console.log(weekDays);
};
function getNumAulas(){
    return aulas;
}
function setCursos(cursosL){
    aulaForSub["Curso"]=cursosL.toString();
};
function setAulas(num){
    aulas = num;
};
function setTurmas(turmasL){
    aulaForSub["Turma"]=turmasL.toString();
};
function setSemestre(num){
    if(num==1){
        aulaForSub["Data da aula"]="02/09/2022";
    }else{
        aulaForSub["Data da aula"]="30/01/2023";}
};
function setTamanhoAula(num){
    aulaForSub["Hora início da aula"]="08:00:00";
    aulaForSub["Hora fim da aula"]=millisecondsToTimestamp(timestampToMilliseconds("08:00:00")+(60000*num));
};
function getAulaforSub(){
    console.log(aulaForSub);
    return aulaForSub;
}

function extractCursos(table){
    const uniqueValues = new Set();
    table.getData().forEach(row => {
        uniqueValues.add(row["Curso"]);
    });
    cursos = Array.from(uniqueValues);
}

function extractTurmas(table){
    const uniqueValues = new Set();
    table.getData().forEach(row => {
        uniqueValues.add(row["Curso"]);
    });
    turmas = Array.from(uniqueValues);
}
function datasLength(){
    return datas.length;
}

function removeSelectedWeekdaysFromMap(selectedWeekdays) {
    selectedWeekdays.forEach(function(day) {
        delete weekDays[day];
    });
    console.log(weekDays);
}

//função que dá set à aula que foi selecionada para ser substituida
function setAulaforSub(dataAula){
    aulaForSub = dataAula;
    //console.log(typeof aulaForSub);
    console.log(aulaForSub);
}

//função que dá set ao conjunto de salas selecionado (sejam estas todas as salas ou apenas algumas)
function setSalas(salas){
    salasAula = salas;
    console.log(salasAula);
}

//funcao que da set as datas em que pode haver aulas antes de qualquer exlcusão, so pode ser chamada depois de se dar set à aulaForSub
function setDatasBasedOnSub(){
    const semestreOneBeg = new Date('2022/09/01');
    const semestreOneEnd = new Date('2022/12/17');
    const semestreTwoBeg = new Date('2023/01/30');
    const semestreTwoEnd = new Date('2023/05/27');
    if(getAulaforSub()["Turno"]=="---"){
        datas = getArrayDatesBetween(semestreOneBeg,semestreOneEnd).concat(getArrayDatesBetween(semestreTwoBeg,semestreTwoEnd));
    }else{
    const dateForCheck = turnToDate(aulaForSub["Data da aula"]);
    if(dateCraft.isSameOrAfterDate(dateForCheck, semestreOneBeg) && dateCraft.isSameOrBeforeDate(dateForCheck, semestreOneEnd)){
        datas = getArrayDatesBetween(semestreOneBeg,semestreOneEnd);
    } else if(dateCraft.isSameOrAfterDate(dateForCheck, semestreTwoBeg) && dateCraft.isSameOrBeforeDate(dateForCheck, semestreTwoEnd)){
        datas = getArrayDatesBetween(semestreTwoBeg,semestreTwoEnd);
    }
    }
    console.log("as datas são: " + datas);
    
}


function setDatas(start, end){
    datas = getArrayDatesBetween(start,end);
    console.log(datas);
}

//função que remove determinado conjunto de salas do conjunto total de salas
function removeSalasFromList(salasToRemove) {
    salasToRemove.forEach(sala => {
        salasAula = salasAula.filter(salaAula => salaAula !== sala);
    });
    console.log(salasAula);
}

//função que devolve determinado conjunto de salas baseado nas suas caracteristicas
function setSalasByType(dataSalas, arrayTypes) {
    const salasOfType = new Set(); // Using a Set to store unique sala names
    const data = JSON.parse(dataSalas);
    data.forEach(obj => {
        arrayTypes.forEach(arrayType => {
            if (obj[arrayType] === "X") {
                salasOfType.add(obj["Nome sala"]); // Add sala name to the Set
            }
        });
    });
    // Convert Set to an array before returning
    return Array.from(salasOfType);
}

//função que gera as horas de inicio possiveis. 
function generateTimeStamps() {
    const timeStamps = [];
    for (let hour = 8; hour <= 21; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const formattedHour = hour.toString().padStart(2, '0');
            const formattedMinute = minute.toString().padStart(2, '0');
            timeStamps.push(`${formattedHour}:${formattedMinute}:00`);
        }
    }
    console.log(timeStamps);
    horasInicio = timeStamps;
}

function removeDuplicatesTimestamps(TimesToRemove) {
    // Filter out timestamps from originalArray that are not present in arrayToRemove
    TimesToRemove.forEach(time => {
        horasInicio = horasInicio.filter(hora => hora !== time);
    });
    console.log(horasInicio);
}

function setSingleDay(){
    datas.push(aulaForSub["Data da aula"]);
    console.log(datas);
}


function generateClassDuration(startTimestamp, endTimestamp) {
    const timestamps = [];
    
    // Convert start and end timestamps to milliseconds
    const startMilliseconds = timestampToMilliseconds(startTimestamp);
    const endMilliseconds = timestampToMilliseconds(endTimestamp);
    
    // Start from the first timestamp
    let currentMilliseconds = startMilliseconds;

    // Loop until we reach the end timestamp
    while (currentMilliseconds <= endMilliseconds) {
        // Convert the current timestamp to a string
        const timestampString = millisecondsToTimestamp(currentMilliseconds);
        
        // Add the timestamp to the array
        timestamps.push(timestampString);
        
        // Move to the next timestamp by adding 30 minutes (1800 seconds)
        currentMilliseconds += 1800000; // 30 minutes in milliseconds
    }
    console.log(timestamps);
    return timestamps;
}

//função que converte timestamps para milisegundos para fazer calculos mais facilmente
function timestampToMilliseconds(timestamp) {
    const [hours, minutes, seconds] = timestamp.split(":").map(Number);
    return hours * 3600000 + minutes * 60000 + seconds * 1000;
}

// Function to convert milliseconds since midnight to timestamp
function millisecondsToTimestamp(milliseconds) {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function generateSubClasses(tabledata){
    /*
        var aulaForSub; //aula que foi selecionada para ser substituida
        var weekDays; //pares de chave valor com números e dias da semana baseados nos resultados da função .getDay() da classe DATE
        var salasAula = []; // array que recebe as salas de aula.
        var horasInicio = []; //array que recebe as horas possiveis de inicio de uma sala.
        var datas = []; //array que guarda todas as datas em que é possivel marcar as aulas; 
    */
    const inicio = timestampToMilliseconds(aulaForSub["Hora início da aula"]);
    const fim = timestampToMilliseconds(aulaForSub["Hora fim da aula"]);
    const duration = fim - inicio;
    const parsedTableData = JSON.parse(tabledata);
    const jsonArray = [];
    const dictionaryOriginal = {};
    //console.log(typeof datas[0]);
    parsedTableData.forEach(aula => {
        const key = aula["Data da aula"] + aula["Sala atribuída à aula"] + aula["Hora início da aula"];
        dictionaryOriginal[key] = aula;
    })


    salasAula.forEach( sala => {
        datas.forEach( data => {
            const dataNovaAula = turnToDate(data);
            const dayOfWeek = dataNovaAula.getDay();
            if(weekDays.hasOwnProperty(dayOfWeek)){
                horasInicio.forEach(hora =>{
                    const copiedAulaForSub = Object.assign({}, aulaForSub);
                    copiedAulaForSub["Dia da semana"] = weekDays[dayOfWeek];
                    copiedAulaForSub["Hora início da aula"] = hora;
                    copiedAulaForSub["Hora fim da aula"] = millisecondsToTimestamp(timestampToMilliseconds(hora) + duration);
                    copiedAulaForSub["Data da aula"] = data;
                    copiedAulaForSub["Semana do Ano"] = giveSemanaAno(data);
                    copiedAulaForSub["Semana do Semestre"] = giveSemanaSemestre(data);
                    copiedAulaForSub["Sala atribuída à aula"] = sala;
                    const key2 = copiedAulaForSub["Data da aula"] + copiedAulaForSub["Sala atribuída à aula"] + copiedAulaForSub["Hora início da aula"];
                    if (!(key2 in dictionaryOriginal)) {
                        jsonArray.push(copiedAulaForSub);
                    }
                });
            }
        });
    });
    console.log(jsonArray);
    return JSON.stringify(jsonArray);
};






export {setSalas, setSalasByType, generateTimeStamps, setAulaforSub, setWeekDays, removeSalasFromList, setDatasBasedOnSub, generateSubClasses, setSingleDay, setDatas, removeDuplicatesTimestamps, generateClassDuration, removeSelectedWeekdaysFromMap, datasLength, getAulaforSub, extractCursos, extractTurmas, setCursos, setTurmas, setAulas, setTamanhoAula, setSemestre, getNumAulas};