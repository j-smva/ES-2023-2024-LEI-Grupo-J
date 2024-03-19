var tabledata = [
				{id:0,Curso:"ME",Unidade_Curricular:"Teoria dos Jogos e dos Contratos",Turno:"01789TP01",Turma:"MEA1",Inscritos_no_Turno:"30",Dia_da_Semana:"Sex",Hora_início_da_aula:"13:00",Hora_fim_da_aula:"14:30",Data_da_aula:"2022-12-02",Características_da_sala_pedida_para_a_aula:"Sala Aulas Mestrado",Sala_atribuída_à_aula:"AA2.25",},
				{id:1,Curso:"ME",Unidade_Curricular:"Teoria dos Jogos e dos Contratos",Turno:"01789TP01",Turma:"MEA1",Inscritos_no_Turno:"30",Dia_da_Semana:"Qua",Hora_início_da_aula:"13:00",Hora_fim_da_aula:"14:30",Data_da_aula:"2022-11-23",Características_da_sala_pedida_para_a_aula:"Sala Aulas Mestrado",Sala_atribuída_à_aula:"AA2.25",},
				{id:2,Curso:"ME",Unidade_Curricular:"Teoria dos Jogos e dos Contratos",Turno:"01789TP01",Turma:"MEA1",Inscritos_no_Turno:"30",Dia_da_Semana:"Qua",Hora_início_da_aula:"13:00",Hora_fim_da_aula:"14:30",Data_da_aula:"2022-11-16",Características_da_sala_pedida_para_a_aula:"Sala Aulas Mestrado",Sala_atribuída_à_aula:"AA2.25",},
				{id:3,Curso:"ME",Unidade_Curricular:"Teoria dos Jogos e dos Contratos",Turno:"01789TP01",Turma:"MEA1",Inscritos_no_Turno:"30",Dia_da_Semana:"Qua",Hora_início_da_aula:"13:00",Hora_fim_da_aula:"14:30",Data_da_aula:"2022-11-09",Características_da_sala_pedida_para_a_aula:"Sala Aulas Mestrado",Sala_atribuída_à_aula:"AA2.25",},
				{id:4,Curso:"ME",Unidade_Curricular:"Teoria dos Jogos e dos Contratos",Turno:"01789TP01",Turma:"MEA1",Inscritos_no_Turno:"30",Dia_da_Semana:"Qua",Hora_início_da_aula:"13:00",Hora_fim_da_aula:"14:30",Data_da_aula:"2022-11-02",Características_da_sala_pedida_para_a_aula:"Sala Aulas Mestrado",Sala_atribuída_à_aula:"AA2.25",},
				{id:5,Curso:"ME",Unidade_Curricular:"Teoria dos Jogos e dos Contratos",Turno:"01789TP01",Turma:"MEA1",Inscritos_no_Turno:"30",Dia_da_Semana:"Seg",Hora_início_da_aula:"13:00",Hora_fim_da_aula:"14:30",Data_da_aula:"2022-11-28",Características_da_sala_pedida_para_a_aula:"Sala Aulas Mestrado",Sala_atribuída_à_aula:"AA2.25",},
				{id:6,Curso:"ME",Unidade_Curricular:"Teoria dos Jogos e dos Contratos",Turno:"01789TP01",Turma:"MEA1",Inscritos_no_Turno:"30",Dia_da_Semana:"Seg",Hora_início_da_aula:"13:00",Hora_fim_da_aula:"14:30",Data_da_aula:"2022-11-21",Características_da_sala_pedida_para_a_aula:"Sala Aulas Mestrado",Sala_atribuída_à_aula:"AA2.25",},
				{id:7,Curso:"ME",Unidade_Curricular:"Teoria dos Jogos e dos Contratos",Turno:"01789TP01",Turma:"MEA1",Inscritos_no_Turno:"30",Dia_da_Semana:"Seg",Hora_início_da_aula:"13:00",Hora_fim_da_aula:"14:30",Data_da_aula:"2022-11-14",Características_da_sala_pedida_para_a_aula:"Sala Aulas Mestrado",Sala_atribuída_à_aula:"AA2.25",},
				{id:8,Curso:"ME",Unidade_Curricular:"Teoria dos Jogos e dos Contratos",Turno:"01789TP01",Turma:"MEA1",Inscritos_no_Turno:"30",Dia_da_Semana:"Seg",Hora_início_da_aula:"13:00",Hora_fim_da_aula:"14:30",Data_da_aula:"2022-11-07",Características_da_sala_pedida_para_a_aula:"Sala Aulas Mestrado",Sala_atribuída_à_aula:"AA2.25",},
				{id:9,Curso:"ME",Unidade_Curricular:"Teoria dos Jogos e dos Contratos",Turno:"01789TP01",Turma:"MEA1",Inscritos_no_Turno:"30",Dia_da_Semana:"Ter",Hora_início_da_aula:"13:00",Hora_fim_da_aula:"14:30",Data_da_aula:"2022-11-29",Características_da_sala_pedida_para_a_aula:"Sala Aulas Mestrado",Sala_atribuída_à_aula:"AA2.25",},
				{id:10,Curso:"TESTE",Unidade_Curricular:"Teoria dos Jogos e dos Contratos",Turno:"01789TP01",Turma:"MEA1",Inscritos_no_Turno:"30",Dia_da_Semana:"Ter",Hora_início_da_aula:"13:00",Hora_fim_da_aula:"14:30",Data_da_aula:"2022-11-29",Características_da_sala_pedida_para_a_aula:"Sala Aulas Mestrado",Sala_atribuída_à_aula:"AA2.25",},
];
var headerMenu = function(){
    var menu = [];
    var columns = this.getColumns();

    for(let column of columns){

        //create checkbox element using font awesome icons
        let icon = document.createElement("i");
        icon.classList.add("fas");
        icon.classList.add(column.isVisible() ? "fa-check-square" : "fa-square");

        //build label
        let label = document.createElement("span");
        let title = document.createElement("span");

        title.textContent = " " + column.getDefinition().title;

        label.appendChild(icon);
        label.appendChild(title);

        //create menu item
        menu.push({
            label:label,
            action:function(e){
                //prevent menu closing
                e.stopPropagation();

                //toggle current column visibility
                column.toggle();

                //change menu item icon
                if(column.isVisible()){
                    icon.classList.remove("fa-square");
                    icon.classList.add("fa-check-square");
                }else{
                    icon.classList.remove("fa-check-square");
                    icon.classList.add("fa-square");
                }
            }
        });
    }

   return menu;
};

var table = new Tabulator("#example-table", {
    data: tabledata,
    layout: "fitColumns",
    pagination: "local",
    paginationSize: 10,
    paginationSizeSelector: [10, 25, 50, 100, true],
    paginationCounter: "rows",
    columns: [
        {title:"Curso", field:"Curso", headerFilter:"input", headerMenu:headerMenu},
        {title:"Unidade_Curricular", field:"Unidade_Curricular", headerFilter:"input", headerMenu:headerMenu},
        {title:"Turno", field:"Turno", headerFilter:"input", headerMenu:headerMenu},
        {title:"Turma", field:"Turma", headerFilter:"input", headerMenu:headerMenu},
        {title:"Inscritos_no_Turno", field:"Inscritos_no_Turno", headerFilter:"input", headerMenu:headerMenu},
        {title:"Dia_da_Semana", field:"Dia_da_Semana", headerFilter:"input", headerMenu:headerMenu},
        {title:"Hora_início_da_aula", field:"Hora_início_da_aula", headerFilter:"input", headerMenu:headerMenu},
        {title:"Hora_fim_da_aula", field:"Hora_fim_da_aula", headerFilter:"input", headerMenu:headerMenu},
        {title:"Data_da_aula", field:"Data_da_aula", headerFilter:"input", headerMenu:headerMenu},
        {title:"Características_da_sala_pedida_para_a_aula", field:"Características_da_sala_pedida_para_a_aula", headerFilter:"input", headerMenu:headerMenu},
        {title:"Sala_atribuída_à_aula", field:"Sala_atribuída_à_aula", headerFilter:"input", headerMenu:headerMenu},
    ],
});

  document.getElementById("Filter").addEventListener("click", function() {
    var button = document.getElementById("Filter");
  	if (button.value == "And") {
    	button.value = "Or";
  	} else {
    	button.value = "And";
  	}
});

table.on("tableBuilt",adaww())
	
function adaww(){
	var headerFilters = table.getHeaderFilters()

	// Loop through the header filters
	headerFilters.forEach(function(filter) {
    	var column = filter.field; // Get the field name of the column
    	var value = filter.value;   // Get the filter value entered by the user
    	console.log("Column: " + column + ", Value: " + value);
	});
};

