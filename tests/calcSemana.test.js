import { describe, test, it, expect } from "vitest";
import { currentWeekNumber, giveSemanaAno, giveSemanaSemestre, turnToDate } from "../js/calcSemanas";

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