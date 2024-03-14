package ProjetoEs.ProjetoEs1;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class CSVReader {
	public static void main(String[] args) {
		//String csvFile = "C:/Users/Asus/Documents/GitHub/ES-2023-2024-LEI-Grupo-J/csv files/HorarioDeExemplo.csv"; // Specify your CSV file path here
		int c = 0;
		String csvFile = "C:/Users/Utilizador/Documents/GitHub/ES-2023-2024-LEI-Grupo-J/csv files/HorarioDeExemplo.csv";
		try {
			List<entrada> dataList = readCSVHorario(csvFile);

			for (entrada row : dataList) {
				c++;
				System.out.println(row.toString());
			}
			System.out.println(c);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}


	public static List<entrada> readCSVHorario(String csvFile) throws IOException {
		List<entrada> listaEntradas = new ArrayList<>();
		try (BufferedReader br = new BufferedReader(new FileReader(csvFile))) {
			String line;
			line = br.readLine();
			while ((line = br.readLine()) != null) {

				String[] data = line.split(";", -1); // Split the line by semicolon
				replaceEmptyValuesHorario(data); // replace emptyStrings
				LocalTime horaInicio = LocalTime.parse(data[6],parser);
				LocalTime horaFim = LocalTime.parse(data[7],parser);
				data[8] = data[8].replace("/","-");
				LocalDate dataAula = LocalDate.parse(data[8], formatter);
				entrada e = new entrada(data[0],data[1],data[2],data[3],Integer.parseInt(data[4]),
						data[5],horaInicio,horaFim,dataAula,data[9],data[10]);
				listaEntradas.add(e);
			} 
		}

		return listaEntradas;
	}


	static DateTimeFormatter parser = DateTimeFormatter.ofPattern("H:mm:ss");
	static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

	// casos: [3], [8], [9], [10] 
	public static void replaceEmptyValuesHorario(String[] data) {
		for(int i=0; i < data.length; i++) {
			switch(i) {
			case 3:
				data[3] = "Não há turma Atribuída";
			case 8:
				data[8] = "11/11/1111";
			case 9:
				data[9] = "Não há características pedidas";
			case 10:
				data[10] = "Não há sala atribuída";
			}
		}
	}



}