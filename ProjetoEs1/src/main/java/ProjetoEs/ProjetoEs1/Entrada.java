package ProjetoEs.ProjetoEs1;
import java.time.LocalDate;
import java.time.LocalTime;
import org.json.simple.JSONObject;

public class Entrada {
	private String curso;
	private String uc;
	private String turno;
	private String turma;
	private int inscritos;
	private String diaSemana;
	private LocalTime horaInicio;
	private LocalTime horaFim;
	private LocalDate dataAula;
	private String tipoPedido;
	private String salaAtribuida;
	private final  LocalDate debugData = LocalDate.of(1111, 11, 11);
	private static final String[] titles = {"Curso","Unidade_Curricular","Turno","Turma","Inscritos_no_Turno","Dia_da_Semana","Hora_início_da_aula","Hora_fim_da_aula",
			"Data_da_aula","Características_da_sala_pedida_para_a_aula","Sala_atribuída_à_aula"};


	public Entrada(String curso, String uc, String turno, String turma, int inscritos, String diaSemana, LocalTime horaInicio, LocalTime horaFim,
			LocalDate dataAula, String tipoPedido, String salaAtribuida) {
		this.curso = curso;
		this.uc = uc;
		this.turno = turno;
		this.turma = turma;
		this.inscritos = inscritos;
		this.diaSemana = diaSemana;
		this.horaInicio = horaInicio;
		this.horaFim = horaFim;
		this.dataAula = dataAula;
		this.tipoPedido = tipoPedido;
		this.salaAtribuida = salaAtribuida;
		//this.semanaAno = calculateSemanaAno();
		
	}


	public Boolean entradaCheck() {
		return (!(this.getTurma().equals("Não há turma Atribuída") && this.getDataAula().equals(debugData) &&
				this.getTipoPedido().equals("Não há características pedidas") &&
				this.getSalaAtribuida().equals("Não há sala atribuída")));
	}


	@Override
	public String toString() {
		return "entrada [curso=" + curso + ", uc=" + uc + ", turno=" + turno + ", turma=" + turma + ", inscritos="
				+ inscritos + ", diaSemana=" + diaSemana + ", horaInicio=" + horaInicio + ", horaFim=" + horaFim
				+ ", dataAula=" + dataAula + ", tipoPedido=" + tipoPedido + ", salaAtribuida=" + salaAtribuida + "]";
	}

	public String toCSVString() {
		return curso + ";" + uc + ";" + turno + ";" + turma + ";" + inscritos + ";" + diaSemana + ";" + horaInicio
				+ ";" + horaFim + ";" + dataAula + ";" + tipoPedido + ";" + salaAtribuida;
	}
	public String toHTMLString() {
		if(this.getDataAula().equals(debugData)) {
			return titles[0] + ":\"" + curso + "\"," + titles[1] + ":\"" + uc + "\"," + titles[2] + ":\"" + turno + "\"," + titles[3] + ":\"" + turma + "\"," + titles[4] + ":\"" + inscritos + "\"," 
					+ titles[5] + ":\"" + diaSemana + "\"," + titles[6] + ":\"" + horaInicio + "\"," + titles[7] + ":\"" + horaFim + "\"," + titles[8] + ":\"" + "-" + "\"," 
					+ titles[9] + ":\"" + tipoPedido + "\"," + titles[10] + ":\"" + salaAtribuida+ "\",";
		}

		return titles[0] + ":\"" + curso + "\"," + titles[1] + ":\"" + uc + "\"," + titles[2] + ":\"" + turno + "\"," + titles[3] + ":\"" + turma + "\"," + titles[4] + ":\"" + inscritos + "\"," 
		+ titles[5] + ":\"" + diaSemana + "\"," + titles[6] + ":\"" + horaInicio + "\"," + titles[7] + ":\"" + horaFim + "\"," + titles[8] + ":\"" + dataAula + "\"," 
		+ titles[9] + ":\"" + tipoPedido + "\"," + titles[10] + ":\"" + salaAtribuida+ "\",";
	}



	public JSONObject toJSON() {

		JSONObject entrada = new JSONObject();

		String[] datat = SaveFile.DATATYPE.split(";");
		String[] datav = this.toCSVString().split(";");

		for(int i = 0; i != datat.length; i++)
			entrada.put(datat[i], datav[i]);

		return entrada;
	}

	public String getCurso() {
		return curso;
	}

	public void setCurso(String curso) {
		this.curso = curso;
	}

	public String getUc() {
		return uc;
	}

	public void setUc(String uc) {
		this.uc = uc;
	}

	public String getTurno() {
		return turno;
	}

	public void setTurno(String turno) {
		this.turno = turno;
	}

	public String getTurma() {
		return turma;
	}

	public void setTurma(String turma) {
		this.turma = turma;
	}

	public int getInscritos() {
		return inscritos;
	}

	public void setInscritos(int inscritos) {
		this.inscritos = inscritos;
	}

	public String getDiaSemana() {
		return diaSemana;
	}

	public void setDiaSemana(String diaSemana) {
		this.diaSemana = diaSemana;
	}

	public LocalTime getHoraInicio() {
		return horaInicio;
	}

	public void setHoraInicio(LocalTime horaInicio) {
		this.horaInicio = horaInicio;
	}

	public LocalTime getHoraFim() {
		return horaFim;
	}

	public void setHoraFim(LocalTime horaFim) {
		this.horaFim = horaFim;
	}

	public LocalDate getDataAula() {
		return dataAula;
	}

	public void setDataAula(LocalDate dataAula) {
		this.dataAula = dataAula;
	}

	public String getTipoPedido() {
		return tipoPedido;
	}

	public void setTipoPedido(String tipoPedido) {
		this.tipoPedido = tipoPedido;
	}

	public String getSalaAtribuida() {
		return salaAtribuida;
	}

	public void setSalaAtribuida(String salaAtribuida) {
		this.salaAtribuida = salaAtribuida;
	}


	public String[] getTitles() {
		return titles;
	}
}
