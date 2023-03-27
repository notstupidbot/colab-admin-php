
// import $ from "jquery"
// import jQuery from "jquery"
// console.log($,jQuery)
// window.$ = $;
// window.jQuery = jQuery;
import "jquery-ui/dist/jquery-ui"

import "jquery-ui/themes/base/all.css"
import "../../jqgrid/js/i18n/grid.locale-id.js"
import "../../jqgrid/js/jquery.jqGrid"
import "../../jqgrid/css/ui.jqgrid.css"
// import "../../jqgrid/css/ui.jqgrid-bootstrap5.css"

// $("#list").remove();

import React ,{useEffect}from "react"
let dontRunTwice=true;
export default class AppGrid extends React.Component{
	loadGrid(){

		const btnCls="";//"w-full sm:w-auto inline-flex justify-center items-center gap-x-3 text-center bg-blue-600 hover:bg-blue-700 border border-transparent text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white transition py-2 px-2 dark:focus:ring-offset-gray-800";
		const gridElem = `
 
<table id="list"></table> <div id="pager"></div>
		`;
		$('#grid-container').empty().append(gridElem)
		const gridConfig = {
			url: 'http://localhost:8080/SistemaEYE-master/clientes/ajax',
			datatype: "json",
			mtype: 'post',
		   	colNames:['Cédula','User', 'Nombres','Apellidos','Email','Sexo','Telf Local','Telf Celular','Nacimiento','Tipo','Password'],
		   	colModel:[
		   		{name:'cedula',index:'cedula', width:50,"searchrules":{integer:true, number:true}, align:'center',editable:true, editrules:{ required:true}},
		   		{name:'usuario',index:'usuario', width:80, editable:true, editrules:{required:true, edithidden:true}, hidden:true},
		   		{name:'nombres',index:'nombres', width:80, editable:true, editrules:{required:true}},
		   		{name:'apellidos',index:'apellidos', width:80, editable:true, editrules:{required:true}},
		   		{name:'email',index:'email', width:80, editable:true, editrules:{required:true, edithidden:true,email:true}, hidden:true},
		   		{name:'sexo',index:'sexo', width:80, formatter:'select', editable:true, edittype:"select" ,editoptions:{value:":;0:Hombre;1:Mujer"}, editrules:{required:true, edithidden:true}, hidden:true},
		   		{name:'tele_local',index:'tele_local', width:80, editable:true, editrules:{required:false, edithidden:true}, hidden:true},
		   		{name:'tele_celular',index:'tele_celular', width:80, editable:true, editrules:{required:false, edithidden:true}, hidden:true},
		   		{name:'f_nacimiento',index:'f_nacimiento', width:80, editable:true, editrules:{required:false, edithidden:true, date:true}, hidden:true},
		   		{name:'tipo',index:'id_tipo',  width:90, "stype":"select","searchoptions":{"value":"a:b"}, editable:true,edittype:"select" ,editoptions:{value:"A;B"},editrules:{ required:true, edithidden:true}, hidden:true},
		   		{name:'psw',index:'psw', editable:true, editrules:{required:false, edithidden:true}, hidden:true},
		  		//{name:'status',index:'status', "stype":"select","searchoptions":{"value": ":;A:Activo;I:Inactivo" }, width:70, align:'center', editable:true,edittype:"checkbox",editoptions:{value:"A:I"}}
		   	],
		   	editurl: 'http://localhost:8080/SistemaEYE-master/clientes/ajax',
		   	multiselect: false,
		   	caption: "Clientes",
		   	jsonReader: {
				repeatitems : false,
				id: "0"
			},
		   	pager: '#pager',
		   	sortname: 'nombres',
		   	width: 960,
		   	height:200
		}

		$("#list").jqGrid(gridConfig).jqGrid("navGrid", "#pager",{edit:true,add:true,del:true,view:true,search:false,excel:false,addtitle:'Agregar Usuarios'}, 
			{height:'auto',resize:true, editCaption:'Modificar Usuarios',afterShowForm:(a,b,c)=>{
				console.log(a,b,c)
			}},
			 {height:'auto',resize:false,addCaption:'Agregar Usuarios',afterShowForm:(a,b,c)=>{
				console.log(a,b,c)
			}}, {},{}, 
			 {height:'auto',resize:false,caption:'Consultar Usuarios',afterShowForm:(a,b,c)=>{
				console.log(a,b,c)
			}})
.jqGrid("filterToolbar");


	}
	componentDidMount(){
		// useEffect(()=>{})
		if(dontRunTwice){
			this.loadGrid()
			console.log('grid mounted')
			// dontRunTwice=false
		}
		
	}
	render(){
		return(<>
			<div id="grid-container"></div>
		</>)
	}
		
}