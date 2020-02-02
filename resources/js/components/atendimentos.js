import React,{Component} from 'react';
import axios from 'axios';
import Pagination from 'react-js-pagination';
import {Redirect} from 'react-router-dom';
import Selecionar from '../imagens/accept.png';
import validar from './validacao/validacao';


export default class Atendimentos extends Component{
    constructor(){
        super();
        this.state = {
            redirect: false,
            atendimento: [],
            atendimentos: [],
            activePage:0,
            itemsCountPerPage:0,
            totalItemsCount:0,
            filtros: [],
            paciente: []
        };

        this.handleChange = this.handleChange.bind(this);
        axios.post('http://systh/api/atendimentos',{})
        .then((response) => {
            this.setState({
                atendimentos: response.data.data,
                activePage: response.data.current_page,
                itemsCountPerPage: response.data.per_page,
                totalItemsCount: response.data.total
            })
            $("#tabela").removeClass("d-none");
            $("#spinner").addClass("d-none");
        });
    }
    
    buscar(e){
        e.preventDefault();
        $("#spinner").removeClass("d-none");
        $("#tabela").addClass("d-none");
        const filtros= {nome: this.state.filtros.nome, mae: this.state.filtros.mae, nascimento: this.state.filtros.nascimento,datainicial: this.state.filtros.dataInicial ,datafinal: this.state.filtros.dataFinal, enfermeiro: this.state.filtros.enfermeiro};
        axios.post('http://systh/api/atendimentos',filtros)
        .then((response) => {
            this.setState({
                atendimentos: response.data.data,
                activePage: response.data.current_page,
                itemsCountPerPage: response.data.per_page,
                totalItemsCount: response.data.total
            })
            $("#spinner").addClass("d-none");
            $("#tabela").removeClass("d-none");
        });    
    }

    handleChange(e){
        var filtros = this.state.filtros;
        var newValue = e.target.value;
        var campo = e.target.id;
        var oldValue = filtros[campo];
        newValue = newValue.toUpperCase();
        var tipo;
        if(campo == 'nascimento' || campo =="dataInicial" || campo =="dataFinal"){
            tipo = 'date';
        }
        else{
            tipo = 'text';
        }
        filtros[campo] = validar(tipo, newValue, oldValue);

        this.setState({
            filtros: filtros
        });
    }

    converteData(data, tipo){
        var dia = data.substring(8,10);
        var mes = data.substring(5,7);
        var ano = data.substring(0,4);
        if(tipo == 'data'){
            return (dia + "/" + mes + "/" + ano);
        }
        else{
            var hora = data.substring(11,16);
            return (hora + " " + dia + "/" + mes + "/" + ano);
        }
    }

    handlePageChange(pageNumber){
        $("#spinner").removeClass("d-none");
        $("#tabela").addClass("d-none");
        var filtros = {dataInicial: this.dataInicial, dataFinal: this.dataFinal, nome: this.nome, mae: this.mae, nascimento: this.nascimento, enfermeiro: this.enfermeiro};
        axios.post("http://systh/api/atendimentos?page="+pageNumber,filtros)
        .then((response)=>{
            this.setState({
                atendimentos: response.data.data,
                activePage: response.data.current_page,
                itemsCountPerPage: response.data.per_page,
                totalItemsCount: response.data.total
            });
            $("#spinner").addClass("d-none");
            $("#tabela").removeClass("d-none");
        })
    }

    selecionar(e,id){
        e.preventDefault();
        var atendimentos = this.state.atendimentos;
        var atendimento = {};
        for(var i = 0; i < atendimentos.length; i++){
            if(id == atendimentos[i].id){
                atendimento = this.state.atendimentos[i];
                break;
            }
        } 
        atendimento.saturacao = atendimento.saturacao?atendimento.saturacao:"";
        atendimento.glasgow = atendimento.glasgow?atendimento.glasgow:"";
        atendimento.tax = atendimento.tax?atendimento.tax:"";
        atendimento.hgt = atendimento.hgt?atendimento.hgt:"";
        atendimento.fc = atendimento.fc?atendimento.fc:"";
        atendimento.peso = atendimento.peso?atendimento.peso:"";
        atendimento.pa = atendimento.pa?atendimento.pa:"";
        atendimento.descricao = atendimento.descricao?atendimento.descricao:"";
        atendimento.fluxograma = "";
        atendimento.discriminador = "";

        axios.get('/api/paciente/'+ atendimento.idPaciente)
        .then(response => this.setState({redirect: true, paciente: response.data[0], atendimento: atendimento}));
    }

    imprimir(e){
        e.preventDefault();

        var atendimentos = this.state.atendimentos;
        var table = "<table><tr class='center'><td><img src='http://systh/images/brasao.png'></td><td colspan='3'><b>PREFEITURA MUNICIPAL DE TEÓFILO OTONI <br> SECRETARIA MUNICIPAL DE SAÚDE <br> Unidade de Pronto Atendimento</b></td><td><img src='images/upa.png'></td></tr>";
        table = table + "<tr class='center'><td colspan='5'><b>SECRETARIA DE ESTADO DE SAÚDE DE MINAS GERAIS</b></td></tr>";
        table = table + "<tr class='center'><td colspan='5'><b>ACOLHIMENTO COM CLASSIFICAÇÃO DE RISCO - SISTEMA DE MANCHESTER</b></td></tr>";
        table = table + "<tr><td colspan='5' bgcolor='C0C0C0'>&nbsp;</td></tr>";
        table = table + "<tr><td><center><b>Registro</b></center></td><td colspan='2'><center><b>Paciente</b></center></td><td><center><b>Cor</b></center></td><td><center><b>Enfermeiro</b></center></td></tr>";
        
        atendimentos.map(e => {
            table = table + "<tr><td><center>"+ e.registro + "</center></td><td colspan='2'>"+ e.paciente +"</td><td>"+ e.cor +"</td><td>"+ e.enfermeiro +"</td><tr>";
        })
        
        table = table + "</table";
        var style = "<style> table{width: 100%; font: 17px Calibri;} table,tr,td {border: solid 2px #000000; border-collapse: collapse;} .center{text-align: center;}</style>";
        var head = "<head><title>Atendimento </title> "+ style +" </head>";
        var body = "<body>"+table+"<body>";
        var win = window.open("","","height=700,width=700");
        win.document.write("<html>");
        win.document.write(head);
        win.document.write(body);
        win.document.write("</html>");
        win.print();
    }

    render(){
        if(this.state.redirect){
            return (
                <Redirect to={{pathname:"/atendimento", state:{atendimento: this.state.atendimento, paciente: this.state.paciente}}}/>
            );
        }
        else{
            return(
                <div className="container-fluid">
                    <div  className="form-group row">
                        <div className="col-md-6">
                            <div className="form-group row">
                                <label htmlFor="nome" className="col-sm-2 col-form-label "> Paciente: </label>
                                <div className="col-sm-10">
                                    <input onChange={this.handleChange} value={this.state.filtros.nome} type="text" className="form-control text-uppercase" id="nome" placeholder="Nome do paciente"/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="mae" className="col-sm-2 col-form-label"> Mãe: </label>
                                <div className="col-sm-10">
                                    <input onChange={this.handleChange} value={this.state.filtros.mae} type="text" className="form-control text-uppercase" id="mae" placeholder="Nome da mãe"/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="enfermeiro" className="col-sm-2 col-form-label"> Enfermeiro: </label>
                                <div className="col-sm-10">
                                    <input onChange={this.handleChange} value={this.state.filtros.enfermeiro} type="text" className="form-control text-uppercase" id="enfermeiro" placeholder="Enfermeiro"/>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group row">
                                <label htmlFor="nascimento" className="col-sm-2 col-form-label"> Nascimento: </label>
                                <div className="col-sm-5">
                                    <input onChange={this.handleChange} value={this.state.filtros.nascimento} type="date" className="form-control" id="nascimento" placeholder="Nascimento"/>
                                </div>
                            </div>
                            <div className="form-group row align-text-middle">
                                <label htmlFor="dataInicial" className="col-sm-2 col-form-label">Entre: </label>
                                <div className="col-sm-4">
                                    <input onChange={this.handleChange} value={this.state.filtros.dataInicial} type="date" className="form-control" id="dataInicial" />
                                </div>
                                -
                                <div className="col-sm-4">
                                    <input onChange={this.handleChange} value={this.state.filtros.dataFinal} type="date" className="form-control" id="dataFinal" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-6">
                                    <button className="btn btn-primary col-8" onClick={e => this.buscar(e)}>Buscar</button>
                                </div>
                                <div className="col-6">
                                    <button className="btn btn-primary col-8" onClick={e => this.imprimir(e)}>Imprimir</button>
                                </div>
                            </div>
                        </div>
                    </div> 
                    <center>
                        <div className="spinner-border " id="spinner" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </center>
                    <div className="col-md-12 d-none" id="tabela">
                        <div className="table-responsive" >
                            <table className="table table-striped">
                                <thead>
                                    <tr scope="row">
                                        <th scope="col" colSpan="3"> Paciente </th>
                                        <th scope="col" colSpan="3"> Mãe </th>
                                        <th scope="col"> Nascimento </th>
                                        <th scope="col"> Cor </th>
                                        <th scope="col"> Data e Hora </th>
                                        <th scope="col"> Enfermeiro </th>
                                        <th scope="col"> </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.atendimentos.map(
                                        row =>
                                        <tr key= {row.id}>
                                            <td colSpan="3"> {row.paciente} </td>
                                            <td colSpan="3"> {row.mae} </td>
                                            <td> {this.converteData(row.nascimento,"data")} </td>
                                            <td> {row.cor}</td>
                                            <td> {new Date(row.created_at).toLocaleString()}</td>
                                            <td> {row.enfermeiro}</td>
                                            <td><button className="btn btn-primary" onClick={e => this.selecionar(e,row.id)}><img src={Selecionar}/></button></td>
                                        </tr>
                                        )}
                                </tbody>
                            </table>
                        </div>
                        <div className="col-12">
                            <center>
                                <div className="col-3">
                                    <Pagination
                                        activePage={this.state.activePage}
                                        itemsCountPerPage={this.state.itemsCountPerPage}
                                        totalItemsCount={this.state.totalItemsCount}
                                        pageRangeDisplayed={5}
                                        onChange={e => this.handlePageChange(e)}
                                        itemClass="page-item"
                                        linkClass="page-link"
                                    />
                                </div>
                            </center>
                        </div>
                    </div>
                </div>    
            );
        }
    }
}
