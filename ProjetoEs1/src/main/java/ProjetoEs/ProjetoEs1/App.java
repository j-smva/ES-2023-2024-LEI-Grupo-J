package ProjetoEs.ProjetoEs1;

import java.awt.Desktop;
import java.awt.FlowLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Scanner;

import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JFrame;

/**
 * Hello world!
 *
 */
public class App {

	// para copy paste:
	// https://raw.githubusercontent.com/j-smva/ES-2023-2024-LEI-Grupo-J/main/csv%20files/HorarioDeExemplo.csv
	// https://raw.githubusercontent.com/j-smva/ES-2023-2024-LEI-Grupo-J/main/csv%20files/Caracteriza%C3%A7%C3%A3oDasSalas.csv
	public static void main(String[] args) throws IOException {
		new MyFrame();
	}

	public static void backup(String[] args) throws IOException {
		Scanner sc = new Scanner(System.in);

		boolean done = false;

		while (done == false) {
			System.out.println("Horario (1) or Salas(2)");
			String option = sc.nextLine();

			if (option.equals("1")) {
				System.out.println("Insert CSV path");
				String fileUrl = sc.nextLine();
				if (fileUrl.startsWith("https://")) {
					String content = ValidateFile.getFileContentRemote(fileUrl);
					CSVReader.entradasHorarioPrinter(CSVReader.readCSVHorario(content));
					done = true;
				} else {
					String content = ValidateFile.getFileContentLocal(fileUrl);
					CSVReader.entradasHorarioPrinter(CSVReader.readCSVHorario(content));
					done = true;
				}
			} else if (option.equals("2")) {
				System.out.println("Insert CSV path");
				String fileUrl = sc.nextLine();
				if (fileUrl.startsWith("https://")) {
					String content = ValidateFile.getFileContentRemote(fileUrl);
					CSVReader.entradasSalaPrinter(CSVReader.readCSVSala(content));
					done = true;
				} else {
					String content = ValidateFile.getFileContentLocal(fileUrl);
					CSVReader.entradasSalaPrinter(CSVReader.readCSVSala(content));
					done = true;
				}
			} else {
				System.out.println("Argumentos Inválidos");
			}

		}

		sc.close();
	}
}
