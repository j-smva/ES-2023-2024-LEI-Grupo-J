package ProjetoEs.ProjetoEs1;

import com.opencsv.CSVWriter;

import java.io.FileWriter;
import java.io.IOException;
import java.util.LinkedList;
import java.util.List;

public class IntoCSV {

	private static final String DATATYPE = "Curso;Unidade Curricular;Turno;Turma;Inscritos no turno;Dia da semana;Hora início da aula;Hora fim da aula;Data da aula;Características da sala pedida para a aula;Sala atribuída à aula";


	public static void writeCSV(List<Entrada> horario, String filepath) {

		List<String[]> haux = new LinkedList<String[]>();
		for (Entrada e : horario)
			haux.add(e.toCSVString().split(";"));


		try (CSVWriter writer = new CSVWriter(new FileWriter(filepath))) {

			writer.writeNext(DATATYPE.split(";"));

			writer.writeAll(haux);

			System.out.println("CSV file written successfully.");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public static void main(String[] args) {
		String csvFile = "C:/Users/Utilizador/Desktop/Docs/uni/3ºano/ES/ES-2023-2024-LEI-Grupo-J/csv files/HorarioDeExemplo.csv";
		String newCSVFile = "C:/Users/Utilizador/Desktop/Docs/uni/3ºano/ES/ES-2023-2024-LEI-Grupo-J/csv files/NewHorario1.csv";
		List<Entrada> horario = CSVReader.readCSVHorario(csvFile);
		writeCSV(horario, newCSVFile);
	}

}