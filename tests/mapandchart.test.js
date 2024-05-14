import { describe, it, expect } from "vitest";
import { heatMapNull, setSalasHeatmap, setSalasByCapacidade, setSalasByNumCaract, sameTime, sameSala, sameDate, getAulaByUc, getAulaByCurso } from "../js/mapandchart";

describe('Setters', () => {
    it('Should log in Console.', () => {
        expect(heatMapNull()).toBeUndefined();
    })

    it('Should log in Console.', () => {
        expect(setSalasHeatmap()).toBeUndefined();
    })

})

describe('Salas by Capacity', () => {
    const salasJson = '[{"Edifício":"Ala Autónoma (ISCTE-IUL)","Nome sala":"Auditório Afonso de Barros","Capacidade Normal":"80","Capacidade Exame":"39","Nº características":"4","Anfiteatro aulas":"","Apoio técnico eventos":"","Arq 1":"","Arq 2":"","Arq 3":"","Arq 4":"","Arq 5":"","Arq 6":"","Arq 9":"","BYOD (Bring Your Own Device)":"","Focus Group":"","Horário sala visível portal público":"X","Laboratório de Arquitectura de Computadores I":"","Laboratório de Arquitectura de Computadores II":"","Laboratório de Bases de Engenharia":"","Laboratório de Electrónica":"","Laboratório de Informática":"","Laboratório de Jornalismo":"","Laboratório de Redes de Computadores I":"","Laboratório de Redes de Computadores II":"","Laboratório de Telecomunicações":"","Sala Aulas Mestrado":"X","Sala Aulas Mestrado Plus":"X","Sala NEE":"","Sala Provas":"","Sala Reunião":"","Sala de Arquitectura":"","Sala de Aulas normal":"X","videoconferência":"","átrio":""}]';
    
    it('Should return Auditório Afonso de Barros.', () => {
        expect(setSalasByCapacidade(salasJson, 80)).toStrictEqual(["Auditório Afonso de Barros"]);
    })

    it('Should return nothing.', () => {
        expect(setSalasByCapacidade(salasJson, 0)).toStrictEqual([]);
    })
})

describe('Salas by Capacity', () => {
    const salasJson = '[{"Edifício":"Ala Autónoma (ISCTE-IUL)","Nome sala":"Auditório Afonso de Barros","Capacidade Normal":"80","Capacidade Exame":"39","Nº características":"4","Anfiteatro aulas":"","Apoio técnico eventos":"","Arq 1":"","Arq 2":"","Arq 3":"","Arq 4":"","Arq 5":"","Arq 6":"","Arq 9":"","BYOD (Bring Your Own Device)":"","Focus Group":"","Horário sala visível portal público":"X","Laboratório de Arquitectura de Computadores I":"","Laboratório de Arquitectura de Computadores II":"","Laboratório de Bases de Engenharia":"","Laboratório de Electrónica":"","Laboratório de Informática":"","Laboratório de Jornalismo":"","Laboratório de Redes de Computadores I":"","Laboratório de Redes de Computadores II":"","Laboratório de Telecomunicações":"","Sala Aulas Mestrado":"X","Sala Aulas Mestrado Plus":"X","Sala NEE":"","Sala Provas":"","Sala Reunião":"","Sala de Arquitectura":"","Sala de Aulas normal":"X","videoconferência":"","átrio":""}]';
    
    it('Should return Auditório Afonso de Barros.', () => {
        expect(setSalasByNumCaract(salasJson, 4)).toStrictEqual(["Auditório Afonso de Barros"]);
    })

    it('Should return nothing.', () => {
        expect(setSalasByNumCaract(salasJson, 0)).toStrictEqual([]);
    })
})

describe('Graph Diagram filtering: Time', () => {
    const aulaJson1 = {"Unidade Curricular":"Teoria dos Jogos e dos Contratos","Turno":"01789TP01","Turma":"MEA1","Dia da semana":"Sex","Hora início da aula":"13:00:00","Hora fim da aula":"14:30:00","Data da aula":"02/12/2022"};
    const aulaJson2 = {"Unidade Curricular":"Teoria dos Jogos e dos Contratos","Turno":"01789TP01","Turma":"MEA1","Dia da semana":"Sex","Hora início da aula":"8:00:00","Hora fim da aula":"9:30:00","Data da aula":"02/12/2022"};
    
    it('Should return true.', () => {
        expect(sameTime(aulaJson1, aulaJson1)).toBe(true);
    })

    it('Should return false.', () => {
        expect(sameTime(aulaJson1, aulaJson2)).toBe(false);
    })
})

describe('Graph Diagram filtering: Sala', () => {
    const aulaJson1 = {"Sala atribuída à aula":"AA2.24"};
    const aulaJson2 = {"Sala atribuída à aula":"AA2.25"};
    
    it('Should return true.', () => {
        expect(sameSala(aulaJson1, aulaJson1)).toBe(true);
    })

    it('Should return false.', () => {
        expect(sameSala(aulaJson1, aulaJson2)).toBe(false);
    })
})

describe('Graph Diagram filtering: Date', () => {
    const aulaJson1 = {"Data da aula":"02/12/2022"};
    const aulaJson2 = {"Data da aula":"01/12/2022"};
    
    it('Should return true.', () => {
        expect(sameDate(aulaJson1, aulaJson1)).toBe(true);
    })

    it('Should return false.', () => {
        expect(sameDate(aulaJson1, aulaJson2)).toBe(false);
    })
})

describe('Graph Diagram filtering: UC', () => {
    const aulaJson = '[{"Curso":"ME","Unidade Curricular":"Teoria dos Jogos e dos Contratos","Turno":"01789TP01","Turma":"MEA1","Inscritos no turno":"30","Dia da semana":"Sex","Hora início da aula":"13:00:00","Hora fim da aula":"14:30:00","Data da aula":"02/12/2022","Semana do Ano":48,"Semana do Semestre":13,"Características da sala pedida para a aula":"Sala Aulas Mestrado","Sala atribuída à aula":"AA2.25"}]';
    const result = {"Curso":"ME","Unidade Curricular":"Teoria dos Jogos e dos Contratos","Turno":"01789TP01","Turma":"MEA1","Inscritos no turno":"30","Dia da semana":"Sex","Hora início da aula":"13:00:00","Hora fim da aula":"14:30:00","Data da aula":"02/12/2022","Semana do Ano":48,"Semana do Semestre":13,"Características da sala pedida para a aula":"Sala Aulas Mestrado","Sala atribuída à aula":"AA2.25"};
    
    it('Should return array with aula.', () => {
        expect(getAulaByUc(aulaJson, "Teoria dos Jogos e dos Contratos")).toStrictEqual([result]);
    })

    it('Should return empty array.', () => {
        expect(getAulaByUc(aulaJson, "Teoria dos Sillys e dos Goosees")).toStrictEqual([]);
    })
})

describe('Graph Diagram filtering: Curso', () => {
    const aulaJson = '[{"Curso":"ME","Unidade Curricular":"Teoria dos Jogos e dos Contratos","Turno":"01789TP01","Turma":"MEA1","Inscritos no turno":"30","Dia da semana":"Sex","Hora início da aula":"13:00:00","Hora fim da aula":"14:30:00","Data da aula":"02/12/2022","Semana do Ano":48,"Semana do Semestre":13,"Características da sala pedida para a aula":"Sala Aulas Mestrado","Sala atribuída à aula":"AA2.25"}]';
    const result = {"Curso":"ME","Unidade Curricular":"Teoria dos Jogos e dos Contratos","Turno":"01789TP01","Turma":"MEA1","Inscritos no turno":"30","Dia da semana":"Sex","Hora início da aula":"13:00:00","Hora fim da aula":"14:30:00","Data da aula":"02/12/2022","Semana do Ano":48,"Semana do Semestre":13,"Características da sala pedida para a aula":"Sala Aulas Mestrado","Sala atribuída à aula":"AA2.25"};
    
    it('Should return array with aula.', () => {
        expect(getAulaByCurso(aulaJson, "ME")).toStrictEqual([result]);
    })

    it('Should return empty array.', () => {
        expect(getAulaByCurso(aulaJson, "Teoria dos Sillys e dos Goosees")).toStrictEqual([]);
    })
})