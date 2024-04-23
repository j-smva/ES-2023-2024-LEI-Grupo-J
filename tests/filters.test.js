import { describe, it, expect, vi } from "vitest";
import { generateFilterExpression, customFilter, formatString } from "../js/filters";

describe('Generate Filter Expressions', () => {
    it('Verificar se dados nenhum parÂmetro é retornado nenhum filtro.',() => {
        //const matrixString = [Filter), FilterModule()];

        //const preString = '((data["Curso"] == "ME" && data["Turma"] == "MEA1") || (data["Curso"] > "ME"))';
        expect(generateFilterExpression("")).toBe("()");
    });
})

describe('Format String', () => {
    it('Verificar que a string de filtro é traduzida para Português.', () => {
        const preString = '((data["Curso"] =="ME"&&data["Turma"] =="MEA1")||(data["Curso"] =="ME"))';

        const postString = '(Curso é "ME" e Turma é "MEA1") ou (Curso é "ME")'

        expect(formatString(preString)).toBe(postString);
    });
})


describe('Costum Filter', () => {
    it('Deve retornar undifined.', () => {
        const filter = '((data["Curso"] =="ME"&&data["Turma"] =="MEA1")||(data["Curso"] =="ME"))';
        expect(customFilter(filter)).toBeUndefined()
    });
})
