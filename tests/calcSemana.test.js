import { describe, test, it, expect } from "vitest";
import { currentWeekNumber, giveSemanaAno, giveSemanaSemestre, turnToDate } from "../js/calcSemanas";

describe('currentWeekNumber', () => {
    it('Should return week number 1', () => {
        const resulta = currentWeekNumber(new Date("01-01-2024"));

        expect(resulta).toBe(1);
    })

    it('Should return week number 2', () => {
        const resultb = currentWeekNumber(new Date("01-08-2024"));

        expect(resultb).toBe(2);
    })

    it('Should not return week number 1', () => {
        const resultc = currentWeekNumber(new Date("11-19-2024"));

        expect(resultc).not.toBe(1);
    })
})

describe('giveSemanaAno', () => {
    it('Should return week number 1', () => {
        const resulta = giveSemanaAno(new Date("01-01-2024"));

        expect(resulta).toBe(1);
    })

})

describe('turnToDate', () => {
    it('Should return equal weeks', () => {
        const weekstr = "01/01/2024";

        expect(giveSemanaAno(weekstr)).toBe(1);
    })

})

describe('giveSemanaAno', () => {
    it('Should return week number 1', () => {
        const weekstr = "01/01/2024";

        expect(giveSemanaAno(weekstr)).toBe(1);
    })

})

describe('giveSemanaSemestre', () => {
    it('Should return week number 1', () => {
        const resulta = giveSemanaSemestre(new Date("09-14-2024"));

        expect(resulta).toBe(1);
    })

})