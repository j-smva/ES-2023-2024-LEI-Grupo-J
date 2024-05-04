import dateCraft from 'date-craft';


/**
 * Current Week Number
 * @param {Date} date - Data onde ocorre uma aula
 * @returns {number} - Número da semana do ano da data onde ocorre a aula
 */
function currentWeekNumber(date){
    var instance;

  if (typeof date === 'string' && date.length) {
    instance = new Date(date);
  } else if (date instanceof Date) {
    instance = date;
  } else {
    instance = new Date();
  }

  // Create a copy of this date object
  var target = new Date(instance.valueOf());

  // ISO week date weeks start on monday
  // so correct the day number
  var dayNr = (instance.getDay() + 6) % 7;

  // ISO 8601 states that week 1 is the week
  // with the first thursday of that year.
  // Set the target date to the thursday in the target week
  target.setDate(target.getDate() - dayNr + 3);

  // Store the millisecond value of the target date
  var firstThursday = target.valueOf();

  // Set the target to the first thursday of the year
  // First set the target to january first
  target.setMonth(0, 1);
  // Not a thursday? Correct the date to the next thursday
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }

  // The weeknumber is the number of weeks between the
  // first thursday of the year and the thursday in the target week
  var weekNumber = 1 + Math.ceil((firstThursday - target) / 604800000);
  return weekNumber;
}

/**
 * Turn to Date
 * @param {String} dateStr - String para ser convertida num objeto Date
 * @returns {Date} - Objeto Date formado a partir da String dada
 */
function turnToDate(dateStr){
    const dateParts = dateStr.split('/');
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
    const year = parseInt(dateParts[2], 10);
    const date = new Date(year, month, day);
    return date;
}

/**
 * Give Semana Semestre
 * @param {Date} date - Data onde ocorre uma aula
 * @returns {number} - Número da semana do semestre da data onde ocorre a aula
 */
function giveSemanaSemestre(date){
    const semestreOneBeg = new Date('2022/09/01');
    const semestreOneEnd = new Date('2022/12/17');
    const semestreTwoBeg = new Date('2023/01/30');
    const semestreTwoEnd = new Date('2023/05/27');
    const actualDate = turnToDate(date);
    if(semestreOneBeg <= actualDate && actualDate <= semestreOneEnd){
        const semanaSemestre = Math.floor((actualDate - semestreOneBeg) / (7 * 24 * 60 * 60 * 1000));
        return semanaSemestre;
    } else if((semestreTwoBeg <= actualDate && actualDate <= semestreTwoEnd)){
        const semanaSemestre = Math.floor((actualDate - semestreTwoBeg) / (7 * 24 * 60 * 60 * 1000));
        return semanaSemestre;
    } else {
        return "Período de avaliações";
    }

}

/**
 * Give Semana Ano,
 * chama as funções Turn to Date e CurrentWeekNumber
 * @param {Date} date - Data onde ocorre uma aula
 * @returns {number} - Número da semana do ano da data onde ocorre a aula
 */
function giveSemanaAno(date){
    const week = currentWeekNumber(turnToDate(date));
    return week;
}

//recebe datas no formato "yyyy/mm/dd" mas faz array com datas no formato "dd/mm/yyy"
function getArrayDatesBetween(start, end){
  const allDates = [];
  let currentDate = start;
  while(dateCraft.isSameOrBeforeDate(currentDate, end)){
    //console.log(currentDate);
    const day = currentDate.getDay();
    if(day !== 0 && day !==6){
      allDates.push(dateCraft.formatDate(currentDate).format('DD/MM/YYYY'));
    }
    currentDate = dateCraft.addDays(currentDate, 1);
  }
  return allDates;
}

//module.exports = currentWeekNumber, giveSemanaAno, giveSemanaSemestre, turnToDate
export {currentWeekNumber, giveSemanaAno, giveSemanaSemestre, turnToDate, getArrayDatesBetween};
