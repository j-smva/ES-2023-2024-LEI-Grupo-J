import { describe, it, expect } from "vitest";
import { timestampToMilliseconds, horasInicioLength, setSalas, setSalasByType, generateTimeStamps, setAulaforSub, setWeekDays, generateClassDuration, datasLength, getAulaforSub, setAulas, getNumAulas} from "../js/suggestion";

describe('Time Stamp to Milis', () => {
    const specificDate1 = '00:00:00';
    const specificDate2 = '00:19:11';

    it('Should give 0 Milis.', () => {
        expect(timestampToMilliseconds(specificDate1)).toBe(0);
    })

    it('Should give respective Milis.', () => {
        expect(timestampToMilliseconds(specificDate2)).toBe(19*60000 + 11*1000);
    })
})

describe('HorasInicio Length', () => {
    it('Should return 0.', () => {
        expect(horasInicioLength()).toBe(0);
    })
})

describe('Datas Length', () => {
    it('Should return 0.', () => {
        expect(datasLength()).toBe(0);
    })
})

describe('Get Salas by Type', () => {
    const salasJson = '[{"Edifício":"Ala Autónoma (ISCTE-IUL)","Nome sala":"Auditório Afonso de Barros","Capacidade Normal":"80","Capacidade Exame":"39","Nº características":"4","Anfiteatro aulas":"","Apoio técnico eventos":"","Arq 1":"","Arq 2":"","Arq 3":"","Arq 4":"","Arq 5":"","Arq 6":"","Arq 9":"","BYOD (Bring Your Own Device)":"","Focus Group":"","Horário sala visível portal público":"X","Laboratório de Arquitectura de Computadores I":"","Laboratório de Arquitectura de Computadores II":"","Laboratório de Bases de Engenharia":"","Laboratório de Electrónica":"","Laboratório de Informática":"","Laboratório de Jornalismo":"","Laboratório de Redes de Computadores I":"","Laboratório de Redes de Computadores II":"","Laboratório de Telecomunicações":"","Sala Aulas Mestrado":"X","Sala Aulas Mestrado Plus":"X","Sala NEE":"","Sala Provas":"","Sala Reunião":"","Sala de Arquitectura":"","Sala de Aulas normal":"X","videoconferência":"","átrio":""}]';
    
    it('Should return Auditório Afonso de Barros.', () => {
        expect(setSalasByType(salasJson, ["Horário sala visível portal público"])).toStrictEqual(["Auditório Afonso de Barros"]);
    })

    it('Should return nothing.', () => {
        expect(setSalasByType(salasJson, ['Arq 6'])).toStrictEqual([]);
    })
})

describe('Setters', () => {
    it('Should log in Console.', () => {
        const a = "a"
        expect(setSalas(a)).toBeUndefined();
    })

    it('Should log in Console.', () => {
        expect(setAulaforSub()).toBeUndefined();
    })

    it('Should log in Console.', () => {
        expect(setAulas()).toBeUndefined();
    })

    it('Should log in Console.', () => {
        expect(generateTimeStamps()).toBeUndefined();
    })

    it('Should log in Console.', () => {
        expect(setWeekDays()).toBeUndefined();
    })

})

describe('Generate Timestamps', () => {
    const date1 = '08:00:00';
    const date2 = '09:30:00';

    it('Should give Timestamp array.', () => {
        expect(generateClassDuration(date1, date2)).toStrictEqual(['08:00:00', '08:30:00', '09:00:00', '09:30:00']);
    })

    it('Should give empty array.', () => {
        expect(generateClassDuration(date2, date1)).toStrictEqual([]);
    })
})

describe('getAulaforSub', () => {
    it('Should return nothing.', () => {
        expect(getAulaforSub()).toBeUndefined();
    })
})

describe('getNumAulas', () => {
    it('Should return nothing.', () => {
        expect(getNumAulas()).toBeUndefined();
    })
})
