package ProjetoEs.ProjetoEs1;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class CSVReader {
    public static void main(String[] args) {
        String csvFile = "C:/Users/Asus/Documents/GitHub/ES-2023-2024-LEI-Grupo-J/csv files/HorarioDeExemplo.csv"; // Specify your CSV file path here
        
        try {
            List<String[]> dataList = readCSV(csvFile);
            
            for (String[] row : dataList) {
                for (String data : row) {
                    System.out.print(data + " ");
                }
                System.out.println();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    public static List<String[]> readCSV(String csvFile) throws IOException {
        List<String[]> dataList = new ArrayList<>();
        
        try (BufferedReader br = new BufferedReader(new FileReader(csvFile))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] data = line.split(";"); // Split the line by semicolon
                dataList.add(data);
                
            }
        }
        
        return dataList;
    }
}