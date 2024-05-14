import { describe, it, expect } from "vitest";
import { currentWeekNumber, giveSemanaAno, giveSemanaSemestre, turnToDate, getArrayDatesBetween } from "../js/calcSemanas";

describe('currentWeekNumber', () => {
    it('Should return week number 1.', () => {
        const resulta = currentWeekNumber(new Date("01-01-2024"));

        expect(resulta).toBe(1);
    })

    it('Should return week number 2.', () => {
        const resultb = currentWeekNumber(new Date("01-08-2024"));

        expect(resultb).toBe(2);
    })

    it('Should not return week number 1.', () => {
        const resultc = currentWeekNumber(new Date("11-19-2024"));

        expect(resultc).not.toBe(1);
    })
})

describe('turnToDate', () => {
    it('Should return equal weeks.', () => {
        const weekstr = "01/01/2024";

        expect(turnToDate(weekstr)).toStrictEqual(new Date("01-01-2024"));
    })

})

describe('giveSemanaAno', () => {
    it('Should return week number 1.', () => {
        const weekstr = "01/01/2024";

        expect(giveSemanaAno(weekstr)).toBe(1);
    })
})

describe('giveSemanaSemestre', () => {
    it('Should return week number 1.', () => {
        const result = giveSemanaSemestre("08/09/2022");

        expect(result).toBe(1);
    })

    it('Should return week number 1.', () => {
        const result = giveSemanaSemestre("08/02/2023");

        expect(result).toBe(1);
    })

    it('Should return Período de Avaliações.', () => {
        const result = giveSemanaSemestre("11/19/2024");

        expect(result).toBe("Período de avaliações");
    })
})

describe('getArrayDatesBetween', () => {

    const date1 = new Date("11/14/2022")
    const date2 = new Date("11/18/2022")

    it('Should return Array of days between.', () => {
        const result = getArrayDatesBetween(date1, date2);

        expect(result).toStrictEqual(["14/11/2022","15/11/2022","16/11/2022","17/11/2022","18/11/2022"]);
    })

    it('Should return array with only date1.', () => {
        const result = getArrayDatesBetween(date1, date1);

        expect(result).toStrictEqual(["14/11/2022"]);
    })

    it('Should return empty array.', () => {
        const result = getArrayDatesBetween(date2, date1);

        expect(result).toStrictEqual([]);
    })
})