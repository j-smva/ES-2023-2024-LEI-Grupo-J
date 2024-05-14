/* eslint-disable no-prototype-builtins */
import dateCraft from 'date-craft';
import { getArrayDatesBetween, turnToDate, giveSemanaAno, giveSemanaSemestre } from './calcSemanas';

//variáveis necessárias para o algoritmo 
/**
 * Variável que guarda a aula que foi selecionada para ser substituída
 * @type {JSON}
 */
var aulaForSub;

/**
 * Mapa que contém os dias da semana a serem considerados associados a valores de 1 a 5
 * @type {Map}
 */
var weekDays;

/**
 * Array que contém as salas de aula a serem consideras
 * @type {Array<String>}
 */
var salasAula = [];

/**
 * Array que guarda as horas de início a serem consideradas
 * @type {Array<String>}
 */
var horasInicio = [];

/**
 * Array que guarda as datas a serem consideradas
 * @type {Array<String>}
 */
var datas = []; 

/**
 * Número de aulas a serem escolhidas das sugestões geradas
 * @type {Number}
 */
var aulas;

/**
 * Função que dá set a todos os dias utéis da semana
 */
function setWeekDays(){
    weekDays = {
        1: "Seg",
        2: "Ter",
        3: "Qua",
        4: "Qui",
        5: "Sex"
      };
    //console.log(weekDays);
};

/**
 * Função utilizada para obter o número de aulas a serem escolhidas
 * @returns {Number} - Número de aulas a serem escolhidas
 */
function getNumAulas(){
    return aulas;
}

 /**
  * Função que recebe um array de strings e coloca essas strings como cursos da aula a ser substituída
  * @param {Array<String>} cursosL - Cursos escolhidos
  */
function setCursos(cursosL){
    aulaForSub["Curso"]=cursosL.toString();
};

/**
 * Função que define o número de aulas a serem escolhidas da tabela de sugestões
 * @param {Number} num - Número de aulas
 */
function setAulas(num){
    aulas = num;
    //console.log("número de aulas é:" + aulas);
};

/**
 * Função que recebe um array de strings e coloca essas strings como turmas da aula a ser substituída
 * @param {Array<String>} turmasL - Turmas escolhidas
 */
function setTurmas(turmasL){
    aulaForSub["Turma"]=turmasL.toString();
};

/**
 * Função que define se as aulas a serem marcadas serão no primeiro ou segundo semestre
 * @param {Number} num - Número do semestre
 */
function setSemestre(num){
    if(num==1){
        aulaForSub["Data da aula"]="02/09/2022";
    }else{
        aulaForSub["Data da aula"]="30/01/2023";}
};

/**
 * Função que define a duração das aulas a serem geradas
 * @param {Number} num - duração da aula em milisegundos
 */
function setTamanhoAula(num){
    aulaForSub["Hora início da aula"]="08:00:00";
    aulaForSub["Hora fim da aula"]=millisecondsToTimestamp(timestampToMilliseconds("08:00:00")+(60000*num));
};

/**
 * Função get para a aula que está a ser considerada
 * @returns {JSON} - Aula a ser considerada
 */
function getAulaforSub(){
    //console.log(aulaForSub);
    return aulaForSub;
}



/**
 * Função utilizada para obter o tamanho do vetor de datas
 * @returns {Number} - tamanho do array de datas a serem consideradas
 */
function datasLength(){
    return datas.length;
}

/**
 * Função utilizada para obter o tamanho do vetor de horas de inicio
 * @returns {Number} - tamanho do array de horas de inicio a serem consideras
 */
function horasInicioLength(){
    return horasInicio.length;
}

/**
 * Função que remove dias da semana específicos do array weekDays
 * @param {Array<Number>} selectedWeekdays - Dias da semana que foram selecionados para serem excluídos
 */
function removeSelectedWeekdaysFromMap(selectedWeekdays) {
    selectedWeekdays.forEach(function(day) {
        delete weekDays[day];
    });
    //console.log(weekDays);
}


/**
 * Função que define a aula que foi selecionada para ser substituída
 * @param {JSON} dataAula - aula que foi selecionada
 */
function setAulaforSub(dataAula){
    aulaForSub = dataAula;
    //console.log(typeof aulaForSub);
    //console.log(aulaForSub);
}

/**
 * Função que define o conjuto de salas a serem consideradas, sejam estas salas específicas ou tipos de salas
 * @param {Array<String>} salas - salas que foram selecionadas
 */
function setSalas(salas){
    salasAula = salas;
    //console.log(salasAula);
}

/**
 * Função que define o conjunto de datas a serem consideradas baseado apenas na data orginal da aula que foi selecionada para substituição
 */
function setDatasBasedOnSub(){
    const semestreOneBeg = new Date('2022/09/01');
    const semestreOneEnd = new Date('2022/12/17');
    const semestreTwoBeg = new Date('2023/01/30');
    const semestreTwoEnd = new Date('2023/05/27');
    datas = [];
    /*if(getAulaforSub()["Turno"]=="---"){
        datas = getArrayDatesBetween(semestreOneBeg,semestreOneEnd).concat(getArrayDatesBetween(semestreTwoBeg,semestreTwoEnd));
    }else{*/
    const dateForCheck = turnToDate(aulaForSub["Data da aula"]);
    if(dateCraft.isSameOrAfterDate(dateForCheck, semestreOneBeg) && dateCraft.isSameOrBeforeDate(dateForCheck, semestreOneEnd)){
        datas = getArrayDatesBetween(semestreOneBeg,semestreOneEnd);
    } else if(dateCraft.isSameOrAfterDate(dateForCheck, semestreTwoBeg) && dateCraft.isSameOrBeforeDate(dateForCheck, semestreTwoEnd)){
        datas = getArrayDatesBetween(semestreTwoBeg,semestreTwoEnd);
    }
    //}
    //console.log(datas);
    
}

/**
 * Função que define as datas a serem consideradas baseado numa data inicial e final
 * @param {Date} start - Data inicial a ser considerada
 * @param {Date} end - Data final a ser considerada
 */
function setDatas(start, end){
    datas = [];
    datas = getArrayDatesBetween(start,end);
    //console.log(datas);
}

/**
 * Função que remove determinado conjunto de salas do conjunto total de salas
 * @param {Array<String>} salasToRemove - salas a serem removidas
 */
function removeSalasFromList(salasToRemove) {
    salasToRemove.forEach(sala => {
        salasAula = salasAula.filter(salaAula => salaAula !== sala);
    });
    //console.log(salasAula);
}

/**
 * Função que devolve o conjuto de salas baseado no conjunto de características escolhido
 * @param {jsonArray} dataSalas - dados sobre as salas de aula
 * @param {Array<String>} arrayTypes - Características de salas a serem procurados
 * @returns {Array<String>} - Array com as salas dos tipos determinados
 */
function setSalasByType(dataSalas, arrayTypes) {
    const salasOfType = new Set();
    const data = JSON.parse(dataSalas);
    data.forEach(obj => {
        arrayTypes.forEach(arrayType => {
            if (obj[arrayType] === "X") {
                salasOfType.add(obj["Nome sala"]);
            }
        });
    });
    return Array.from(salasOfType);
}

/**
 * Função que gera todas as timestamps de início possíveis: 08:00:00 até 21:30:00
 */
function generateTimeStamps() {
    const timeStamps = [];
    for (let hour = 8; hour <= 21; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const formattedHour = hour.toString().padStart(2, '0');
            const formattedMinute = minute.toString().padStart(2, '0');
            timeStamps.push(`${formattedHour}:${formattedMinute}:00`);
        }
    }
    //console.log(timeStamps);
    horasInicio = timeStamps;
}

/**
 * Função que remove um conjunto de timestamps do conjunto total a ser considerado
 * @param {Array<String>} TimesToRemove - Timestamps a serem removidas
 */
function removeDuplicatesTimestamps(TimesToRemove) {
    // Filter out timestamps from originalArray that are not present in arrayToRemove
    TimesToRemove.forEach(time => {
        horasInicio = horasInicio.filter(hora => hora !== time);
    });
    //console.log(horasInicio);
}

/**
 * Função que define que a data a ser considerada para a substituição da aula é um único dia
 */
function setSingleDay(){
    datas = [];
    datas.push(aulaForSub["Data da aula"]);
    //console.log(datas);
}

/**
 * Função que dados dois timestamps devolve um array de todos os timestamps de inicio possiveis que ocorrem no intervalo descrito
 * @param {String} startTimestamp - Timestamp inicial
 * @param {String} endTimestamp - Timestamp final
 * @returns {Array<String>} - Array com timestamps que ocorrem no intervalo pretendido
 */
function generateClassDuration(startTimestamp, endTimestamp) {
    const timestamps = [];
    
    //Converter timestamps em milisegundos
    const startMilliseconds = timestampToMilliseconds(startTimestamp);
    const endMilliseconds = timestampToMilliseconds(endTimestamp);
    
    //Começar a partir da primeira timestamp
    let currentMilliseconds = startMilliseconds;

    //Ciclo até atingirmos a timestamp final
    while (currentMilliseconds <= endMilliseconds) {
        //Converter os milisegundos atuais numa timestamp
        const timestampString = millisecondsToTimestamp(currentMilliseconds);
        
        //Adicionar a timestamps no array a devolver
        timestamps.push(timestampString);
        
        //Passar a próxima timestamp ao adicionar 30 minutos
        currentMilliseconds += 1800000; // 30 minutos em milisegundos
    }
    //console.log(timestamps);
    return timestamps;
}

/**
 * Função que converte uma timestamp em milisegundos para facilitar o cálculo de tempos com timestamps
 * @param {String} timestamp - Timestamp a converter 
 * @returns {Number} - Timestamp em milisegundos
 */
function timestampToMilliseconds(timestamp) {
    const [hours, minutes, seconds] = timestamp.split(":").map(Number);
    return hours * 3600000 + minutes * 60000 + seconds * 1000;
}

/**
 * Função que converte uma quantidade de milisegundos desde a meia-noite de volta a uma timestamp
 * @param {Number} milliseconds - milisegundos desde a meia noite
 * @returns {String} - Timestamp convertida
 */
function millisecondsToTimestamp(milliseconds) {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}


/**
 * Função que gera as sugestões de alocação ou substituição
 * @param {jsonArray} tabledata - dados da tabela principal para calcular conflitos de aulas
 * @returns {String} - Entradas da tabela de sugestões 
 */
function generateSubClasses(tabledata) {
    const inicio = timestampToMilliseconds(aulaForSub["Hora início da aula"]);
    const fim = timestampToMilliseconds(aulaForSub["Hora fim da aula"]);
    const duration = fim - inicio;
    const jsonArray = [];
    const dictionaryOriginal = {};
    const parsedTableData = JSON.parse(tabledata);

    parsedTableData.forEach(aula => {
        const durationAula = timestampToMilliseconds(aula["Hora fim da aula"]) - timestampToMilliseconds(aula["Hora início da aula"]);
        const key = aula["Data da aula"] + aula["Sala atribuída à aula"];
        const value = [aula["Hora início da aula"], durationAula];

        if (!(key in dictionaryOriginal)) {
            dictionaryOriginal[key] = [];
        }

        dictionaryOriginal[key].push(value);
    });

    salasAula.forEach(sala => {
        datas.forEach(data => {
            const dataNovaAula = turnToDate(data);
            const dayOfWeek = dataNovaAula.getDay();

            if (weekDays.hasOwnProperty(dayOfWeek)) {
                horasInicio.forEach(hora => {
                    const copiedAulaForSub = Object.assign({}, aulaForSub);
                    copiedAulaForSub["Dia da semana"] = weekDays[dayOfWeek];
                    copiedAulaForSub["Hora início da aula"] = hora;
                    copiedAulaForSub["Hora fim da aula"] = millisecondsToTimestamp(timestampToMilliseconds(hora) + duration);
                    copiedAulaForSub["Data da aula"] = data;
                    copiedAulaForSub["Semana do Ano"] = giveSemanaAno(data);
                    copiedAulaForSub["Semana do Semestre"] = giveSemanaSemestre(data);
                    copiedAulaForSub["Sala atribuída à aula"] = sala;

                    const key2 = copiedAulaForSub["Data da aula"] + copiedAulaForSub["Sala atribuída à aula"];

                    let hasOverlap = false;

                    if (dictionaryOriginal.hasOwnProperty(key2)) {
                        dictionaryOriginal[key2].forEach(item => {
                            const existingClassStart = item[0];
                            const existingClassEnd = millisecondsToTimestamp(timestampToMilliseconds(item[0]) + item[1]);
                    
                            if (
                                //Confere se existe conflito entre a aula com a chave e a aula que foi gerada
                                (copiedAulaForSub["Hora início da aula"] >= existingClassStart && copiedAulaForSub["Hora início da aula"] < existingClassEnd) ||
                                (copiedAulaForSub["Hora fim da aula"] > existingClassStart && copiedAulaForSub["Hora fim da aula"] <= existingClassEnd)
                            ) {
                                //Existe conflito
                                hasOverlap = true;
                                //console.log("Overlap detected");
                            }
                        });
                    }
                    
                    //Não existe conflito ou a chave não está presente no dicionário original
                    if (!hasOverlap) {
                        jsonArray.push(copiedAulaForSub);
                    }
                });
            }
        });
    });

    //console.log(jsonArray);
    return JSON.stringify(jsonArray);
}







export { timestampToMilliseconds ,horasInicioLength,setSalas, setSalasByType, generateTimeStamps, setAulaforSub, setWeekDays, removeSalasFromList, setDatasBasedOnSub, generateSubClasses, setSingleDay, setDatas, removeDuplicatesTimestamps, generateClassDuration, removeSelectedWeekdaysFromMap, datasLength, getAulaforSub, setCursos, setTurmas, setAulas, setTamanhoAula, setSemestre, getNumAulas};