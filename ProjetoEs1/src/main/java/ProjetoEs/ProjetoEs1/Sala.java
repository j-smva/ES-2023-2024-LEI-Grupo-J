package ProjetoEs.ProjetoEs1;

import java.util.ArrayList;
import java.util.List;

public class Sala {

	private static final String[] CARACT = {"Anfiteatro aulas", "Apoio técnico eventos", "Arq 1", "Arq 2", "Arq 3", "Arq 4", "Arq 5", "Arq 6", "Arq 9", "BYOD (Bring Your Own Device)", "Focus Group", "Horário sala visível portal público", "Laboratório de Arquitectura de Computadores I", "Laboratório de Arquitectura de Computadores II", "Laboratório de Bases de Engenharia", "Laboratório de Electrónica", "Laboratório de Informática", "Laboratório de Jornalismo", "Laboratório de Redes de Computadores I", "Laboratório de Redes de Computadores II", "Laboratório de Telecomunicações", "Sala Aulas Mestrado", "Sala Aulas Mestrado Plus", "Sala NEE", "Sala Provas", "Sala Reunião", "Sala de Arquitectura", "Sala de Aulas normal", "Videoconferência", "Átrio"};
	
	private String edificio;
	private String nome;
	
	// c - capacidade
	private int cNormal;
	private int cExame;
	
	// private int ncaracteristicas;
	
	// caracteristicas da sala
	private List<String> crtc;
	
	
	public Sala(String[] lst) {
		
		this.edificio = lst[0]; this.nome = lst[1];
		
		this.cNormal = Integer.valueOf(lst[2]); this.cExame = Integer.valueOf(lst[3]);
		
		this.crtc = new ArrayList<String>();
        for(int i = 0; i < lst.length - 5; i++) {
            if(lst[4 + i].equals("X"))
            	this.crtc.add(CARACT[i]);
        }
	}

	public static void main(String[] args) {
		try {
			System.out.print(CARACT.length);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		/*
		String a = "Edif�cio II (ISCTE-IUL);C0.08;1;0;1;;;;;;;;;;;;X;;;;;;;;;;;;;;;;;;";
		String[] lst = a.split(";");
		Sala s = new Sala(a);
		System.out.print(s.toString());
		*/
	}
	
	@Override
	public String toString() {
		String s = "Edifício: " + edificio + ", Nome: " + nome;
		s += ", Capacidade Normal: " + String.valueOf(cNormal) + ", Capacidade Exame: " + String.valueOf(cExame);
		s += ", Número de Características: " + getNCaracteristicas() + ", Características: ";
		for(String str : crtc)
			s += str + " ";
		return s;
	}

	public int getNCaracteristicas() {
		return crtc.size();
	}
	
	public String getEdificio() {
		return edificio;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public int getcNormal() {
		return cNormal;
	}

	public void setcNormal(int cNormal) {
		this.cNormal = cNormal;
	}

	public int getcExame() {
		return cExame;
	}

	public void setcExame(int cExame) {
		this.cExame = cExame;
	}

	public List<String> getCrtc() {
		return crtc;
	}

	public void setCrtc(List<String> crtc) {
		this.crtc = crtc;
	}
}