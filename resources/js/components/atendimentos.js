import React,{Component} from 'react';
import axios from 'axios';
import Pagination from 'react-js-pagination';
import {Redirect} from 'react-router-dom';


export default class Atendimentos extends Component{
    constructor(){
        super();
        this.state = {
            atendimentos: [],
            activePage:1,
            itemsCountPerPage:1,
            totalItemsCount:1
        };
    }

    buscar(e){
        e.preventDefault();
        if(true){
            var filtros = {dataInicial: this.dataInicial, dataFinal: this.dataFinal, nome: this.nome, mae: this.mae, nascimento: this.nascimento, enfermeiro: this.enfermeiro};
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
        
    }

    handlePageChange(pageNumber){
        var filtros = {dataInicial: this.dataInicial, dataFinal: this.dataFinal, nome: this.nome, mae: this.mae, nascimento: this.nascimento, enfermeiro: this.enfermeiro};
        axios.get("http://systh/api/atendimentos?page="+pageNumber)
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
        return (<Redirect to={{pathname: "/atendimento", state: atendimento}} />);
    }
    render(){
        return(
            <div className="container-fluid">
                <div  className="form-group row">
                    <div className="col-6">
                        <div className="form-group row">
                            <label htmlFor="nome" className="col-sm-2 col-form-label "> Paciente: </label>
                            <div className="col-sm-10">
                                <input onChange={e => this.nome = e.target.value} type="text" className="form-control text-uppercase" id="nome" placeholder="Nome do paciente"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="mae" className="col-sm-2 col-form-label"> Mãe: </label>
                            <div className="col-sm-10">
                                <input onChange={e => this.mae = e.target.value} type="text" className="form-control text-uppercase" id="mae" placeholder="Nome da mãe"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="enfermeiro" className="col-sm-2 col-form-label"> Enfermeiro: </label>
                            <div className="col-sm-10">
                                <input onChange={e => this.enfermeiro = e.target.value} type="text" className="form-control text-uppercase" id="enfermeiro" placeholder="Enfermeiro"/>
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="form-group row">
                            <label htmlFor="nascimento" className="col-sm-2 col-form-label"> Nascimento: </label>
                            <div className="col-sm-5">
                                <input onChange={e => this.nascimento = e.target.value} type="date" className="form-control" id="nascimento" placeholder="Nascimento"/>
                            </div>
                        </div>
                        <div className="form-group row align-text-middle">
                            <label htmlFor="mae" className="col-sm-2 col-form-label">Entre: </label>
                            <div className="col-sm-4">
                                <input onChange={e => this.dataInicial = e.target.value} type="date" className="form-control" id="mae" />
                            </div>
                            -
                            <div className="col-sm-4">
                                <input onChange={e => this.dataFinal = e.target.value} type="date" className="form-control" id="mae" />
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
                                    <th scope="col"> Registro </th>
                                    <th scope="col"> Paciente </th>
                                    <th scope="col"> Mãe </th>
                                    <th scope="col"> Nascimento </th>
                                    <th scope="col"> Classificação </th>
                                    <th scope="col"> Data e Hora </th>
                                    <th scope="col"> </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.atendimentos.map(
                                    row =>
                                    <tr key= {row.id}>
                                        <td> {row.registro} </td>
                                        <td> {row.paciente} </td>
                                        <td> {row.mae} </td>
                                        <td> {row.nascimento} </td>
                                        <td> {row.cor}</td>
                                        <td> {row.created_at}</td>
                                        <td><button className="btn btn-primary" onClick={e => this.selecionar(e,row.id)}>Selecionar</button></td>
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
