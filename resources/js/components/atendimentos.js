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
            filtros: []
        };

        this.handleChange = this.handleChange.bind(this);
        const filtros = {nome: this.state.filtros.nome, mae: this.state.filtros.mae, nascimento: this.state.filtros.nascimento,datainicial: this.state.filtros.dataInicial ,datafinal: this.state.filtros.dataFinal};
        axios.post('http://systh/api/atendimentos',filtros)
        .then(response => {
            this.setState({
                atendimentos: response.data.data,
                activePage: response.data.current_page,
                itemsCountPerPage: response.data.per_page,
                totalItemsCount: response.data.total
            })
        });
    }
    
    buscar(e){
        e.preventDefault();
        const filtros= {nome: this.state.filtros.nome, mae: this.state.filtros.mae, nascimento: this.state.filtros.nascimento,datainicial: this.state.filtros.dataInicial ,datafinal: this.state.filtros.dataFinal}
        console.log(filtros)
        axios.post('http://systh/api/atendimentos',filtros)
        .then(response => {
            this.setState({
                atendimentos: response.data.data,
                activePage: response.data.current_page,
                itemsCountPerPage: response.data.per_page,
                totalItemsCount: response.data.total
            })
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

    coverteData(data, tipo){
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
        var filtros = {dataInicial: this.dataInicial, dataFinal: this.dataFinal, nome: this.nome, mae: this.mae, nascimento: this.nascimento, enfermeiro: this.enfermeiro};
        axios.post("http://systh/api/atendimentos?page="+pageNumber,filtros)
        .then(response=>{
            this.setState({
                atendimentos: response.data.data,
                activePage: response.data.current_page,
                itemsCountPerPage: response.data.per_page,
                totalItemsCount: response.data.total
            })
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
        this.setState({redirect: true, atendimento: atendimento});
    }

    render(){
        if(this.state.redirect){
            return (
                <Redirect to={{pathname:"/atendimento", state:{atendimento: this.state.atendimento}}}/>
            );
        }
        else{
            return(
                <div className="container-fluid">
                    <div  className="form-group row">
                        <div className="col-6">
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
                        <div className="col-6">
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
                                <div className="col-12">
                                    <button className="btn btn-primary col-4" onClick={e => this.buscar(e)}>Buscar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="col-12">
                            <table className="table table-striped">
                                <thead>
                                    <tr scope="row">
                                        <th scope="col" colSpan="3"> Paciente </th>
                                        <th scope="col" colSpan="3"> Mãe </th>
                                        <th scope="col"> Nascimento </th>
                                        <th scope="col"> Cor </th>
                                        <th scope="col"> Data e Hora </th>
                                        <th scope="col"> </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.atendimentos.map(
                                        row =>
                                        <tr key= {row.id}>
                                            <td colSpan="3"> {row.paciente} </td>
                                            <td colSpan="3"> {row.mae} </td>
                                            <td> {this.coverteData(row.nascimento,"data")} </td>
                                            <td> {row.cor}</td>
                                            <td> {new Date(row.created_at).toLocaleString()}</td>
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
