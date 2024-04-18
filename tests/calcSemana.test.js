const currentWeekNumber = require('./calcSemana.js');

const giveSemanaAno = require('./calcSemana.js');

const giveSemanaSemestre = require('./calcSemana.js');

const turnToDate = require('./calcSemana.js');


test("Current Week Number is Correct.", () => {
    let week = new Date("01-01-2024");
    print(currentWeekNumber(week));

    expect(currentWeekNumber(week)).toBe(1);
})