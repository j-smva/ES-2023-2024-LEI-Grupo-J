package ProjetoEs.ProjetoEs1;

import java.awt.FlowLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.io.IOException;

import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JTextField;

public class MyFrame extends JFrame implements ActionListener {

	JButton FileButton;
	JTextField textField;
    JButton ConfirmButton;

	MyFrame() {
		this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		this.setLayout(new FlowLayout());
		FileButton = new JButton("Select File");
		FileButton.addActionListener(this);
        textField = new JTextField(20);
        this.add(textField);

        // Button for confirmation
        ConfirmButton = new JButton("Confirm Git");
        ConfirmButton.addActionListener(this);
        this.add(ConfirmButton);

		this.add(FileButton);
		this.pack();
		this.setVisible(true);
		
	}
 
	@Override
	public void actionPerformed(ActionEvent e){
		if (e.getSource() == FileButton) {
			JFileChooser fileChooser = new JFileChooser();
			fileChooser.setCurrentDirectory(new File("."));
			int response = fileChooser.showOpenDialog(null);
			if (response == JFileChooser.APPROVE_OPTION) {
				File file = new File(fileChooser.getSelectedFile().getAbsolutePath());
				String content = null;
				try {
					content = ValidateFile.getFileContentLocal(file.getPath());
				} catch (IOException e1) {
					e1.printStackTrace();
				}
				CSVReader.entradasHorarioPrinter(CSVReader.readCSVHorario(content));
			}
		}else if (e.getSource() == ConfirmButton) {
			String userInput = textField.getText();
			if (userInput.startsWith("https://")) {
				String content = null;
				try {
					content = ValidateFile.getFileContentRemote(userInput);
				} catch (IOException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
				CSVReader.entradasHorarioPrinter(CSVReader.readCSVHorario(content));
		}else {
			JOptionPane.showMessageDialog(this, "Please enter a valid link", "Warning", JOptionPane.WARNING_MESSAGE);
		}
			}
	}
}
