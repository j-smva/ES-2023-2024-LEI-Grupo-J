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
	}

	public static List<Entrada> readCSVHorario(String fileContent){
		List<Entrada> listaEntradas = new ArrayList<>();
		String[] entries = fileContent.split("\r?\n"); // Split the line by semicolon
		for(int i = 1; i != entries.length; i++) {
			String[] data = entries[i].split(";",-1);
			replaceEmptyValuesHorario(data); // replace emptyStrings
			LocalTime horaInicio = LocalTime.parse(data[6],parser);
			LocalTime horaFim = LocalTime.parse(data[7],parser);
			LocalDate dataAula = LocalDate.parse(data[8].replace("/", "-"), formatter);
			Entrada e = new Entrada(data[0],data[1],data[2],data[3],Integer.parseInt(data[4]),data[5],horaInicio,horaFim,dataAula,data[9],data[10]);
			if(e.entradaCheck())
				listaEntradas.add(e);
		}
		return listaEntradas;
	}
	
	public static void entradasHorarioPrinter(List<Entrada> entradas) {
		int c = 0;
		for(Entrada row : entradas) {
			c++;
			System.out.println(row.toString());
		}
		System.out.println(c);
	}
	
	public static void entradasSalaPrinter(List<Sala> salas) {
		int c = 0;
		for(Sala row : salas) {
			c++;
			System.out.println(row.toString());
		}
		System.out.println(c);
	}
	
	
	public static List<Sala> readCSVSala(String fileContent){
		List<Sala> listaSalas = new ArrayList<>();
		String[] entries = fileContent.split("\r?\n"); // Split the line by semicolon
		for(int i = 1; i != entries.length; i++) {
			String[] data = entries[i].split(";",-1);
			replaceEmptyValuesSala(data);
			Sala s = new Sala(data);
			listaSalas.add(s);
		}
		return listaSalas;
	}

	static DateTimeFormatter parser = DateTimeFormatter.ofPattern("H:mm:ss");
	static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

	// casos: [3], [8], [9], [10] 
	public static void replaceEmptyValuesHorario(String[] data) {
		for(int i=0; i < data.length; i++) {
			if(data[i] != null && data[i].isEmpty()) {
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
	public static void replaceEmptyValuesSala(String[] data) {
		for(int i=0; i < data.length; i++) {
			if(data[i] != null && data[i].isEmpty()) {
				data[i]=" ";
				
			}
		}
		
	}


}