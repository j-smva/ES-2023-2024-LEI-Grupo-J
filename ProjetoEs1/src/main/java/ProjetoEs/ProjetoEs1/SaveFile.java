package ProjetoEs.ProjetoEs1;

import com.opencsv.CSVWriter;

import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.json.simple.JSONArray;

public class SaveFile {

	public static final String DATATYPE = "Curso;Unidade Curricular;Turno;Turma;Inscritos no turno;Dia da semana;Hora início da aula;Hora fim da aula;Data da aula;Características da sala pedida para a aula;Sala atribuída à aula";


	public static void saveAsCSV(List<Entrada> horario, String filepath) {

		List<String[]> haux = new ArrayList<String[]>();
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

	public static void saveAsJSON(List<Entrada> horario, String filepath) {

		JSONArray entradas = new JSONArray();
		for (Entrada e : horario)
			entradas.add(e.toJSON());

		try {
			FileWriter file = new FileWriter(filepath);

			file.write(formatJSON(entradas.toString()));

			file.close();
			System.out.println("JSON file written successfully.");
		} catch (IOException e) {
			e.printStackTrace();
		}

	}
	
	private static String formatJSON(String jsonStr) {
        StringBuilder formattedJSON = new StringBuilder();
        int indentLevel = 0;
        for (char c : jsonStr.toCharArray()) {
            if (c == '[' || c == '{')
                formattedJSON.append(c).append("\n").append(indent(++indentLevel));
            else if (c == ']' || c == '}')
                formattedJSON.append("\n").append(indent(--indentLevel)).append(c);
            else if (c == ',')
                formattedJSON.append(c).append("\n").append(indent(indentLevel));
            else
                formattedJSON.append(c);
        }
        return formattedJSON.toString();
    }

    private static String indent(int level) {
        StringBuilder indent = new StringBuilder();
        for (int i = 0; i < level; i++)
            indent.append("  ");
        return indent.toString();
    }

	public static void main(String[] args) throws IOException {
		String csvFile = "C:/Users/Utilizador/Desktop/Docs/uni/3ºano/ES/ES-2023-2024-LEI-Grupo-J/csv files/HorarioDeExemplo.csv";
		String newCSVFile = "C:/Users/Utilizador/Desktop/Docs/uni/3ºano/ES/ES-2023-2024-LEI-Grupo-J/csv files/NewHorario";
		String content = ValidateFile.getFileContentLocal(csvFile);
		CSVReader.readCSVHorario(content);

		List<Entrada> horario = CSVReader.readCSVHorario(content);
		saveAsCSV(horario, newCSVFile + ".csv");
		saveAsJSON(horario, newCSVFile + ".json");
	}

}