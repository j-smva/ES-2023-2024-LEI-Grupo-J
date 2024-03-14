package ProjetoEs.ProjetoEs1;
import java.time.*;


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
	}
	
	public Entrada(String curso, String uc, String turno, String turma, int inscritos, String diaSemana, LocalTime horaInicio, LocalTime horaFim,
			LocalDate dataAula, String tipoPedido) {
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
		this.salaAtribuida = "Sala Não Atribuída";
	}
	
	public Boolean entradaCheck() {
		return (this.getTurma() != "Não há turma Atribuída" && !(this.getDataAula().equals("11/11/1111")) &&
				this.getTipoPedido() != "Não há características pedidas" &&
				this.getSalaAtribuida() != "Não há sala atribuída");
	}

	@Override
	public String toString() {
		return "entrada [curso=" + curso + ", uc=" + uc + ", turno=" + turno + ", turma=" + turma + ", inscritos="
				+ inscritos + ", diaSemana=" + diaSemana + ", horaInicio=" + horaInicio + ", horaFim=" + horaFim
				+ ", dataAula=" + dataAula + ", tipoPedido=" + tipoPedido + ", salaAtribuida=" + salaAtribuida + "]";
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
}
