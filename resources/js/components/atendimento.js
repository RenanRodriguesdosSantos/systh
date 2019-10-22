import React, {Component} from 'react';
import CaPaciente from './caPaciente';
import axios from 'axios';
import Pagination from 'react-js-pagination';

export default class Atendimento extends Component{
    constructor(){
        super();
        this.state = {  pacientes: [],
                        paciente: [], 
                        fluxograma: [], 
                        discriminador: [],
                        user: [],
                        classificacao: "",
                        activePage:1,
                        itemsCountPerPage:1,
                        totalItemsCount:1
                    };

        this.nome ="";
        this.mae ="";
        this.nascimento = "";
                
        axios.get("http://systh/user")
        .then(response => {this.setState({user: response.data})});

        this.preencherFluxograma();
    }

    handlePageChange(pageNumber){
        const pacientes = {
            nome: this.nome,
            mae: this.mae,
            nascimento: this.nascimento
        }
        axios.post("http://systh/api/paciente?page="+pageNumber,pacientes)
        .then(response=>{
            this.setState({
                pacientes: response.data.data,
                activePage: response.data.current_page,
                itemsCountPerPage: response.data.per_page,
                totalItemsCount: response.data.total
            })
        })
    }

    preencherFluxograma(){ // Busca no Banco os dados para preenchimento do ComboBox Fluxograma;
        axios.get("http://systh/api/fluxograma")
        .then(response => {this.setState({fluxograma: response.data})});
    }

    preencherDiscriminador(e){
        this.fluxograma = e.target.value;
        for(var i = 0; i < this.state.fluxograma.length; i++){
            if(this.fluxograma == this.state.fluxograma[i].nome){
                this.fluxograma = this.state.fluxograma[i].id;
                break;
            }
        }
        if(typeof this.fluxograma === "number"){
            axios.get("http://systh/api/discriminador/"+this.fluxograma)
            .then(response => {this.setState({discriminador: response.data})});
        } 
    }

    buscar(e){
        e.preventDefault();
        if(!(this.nome === "" && this.mae === "" && this.nascimento === "")){
            const pacientes = {
                nome: this.nome,
                mae: this.mae,
                nascimento: this.nascimento
            }
            axios.post('http://systh/api/paciente',pacientes)
            .then(response => {
                this.setState({
                    pacientes: response.data.data,
                    activePage: response.data.current_page,
                    itemsCountPerPage: response.data.per_page,
                    totalItemsCount: response.data.total
                })
            });
    
            document.getElementById('nome2').value = this.nome;
            document.getElementById('mae2').value = this.mae;
            document.getElementById('nascimento2').value = this.nascimento;
        }
        
    }

    selecionar(row){
        document.getElementById('nome').value = row.nome;
        document.getElementById('mae').value = row.mae;
        document.getElementById('nascimento').value = row.nascimento;  
        this.idPaciente = row.id; 
    }

    classificar(e){
        e.preventDefault();
        for(var i = 0; i < this.state.discriminador.length; i++){
            if(this.discriminador === this.state.discriminador[i].nome){
                this.classificacao = this.state.discriminador[i].id;
                this.state.classificacao = this.paciente + " classificado como " + this.state.discriminador[i].cor;
                break;
            }
        }
    }

    incluir(e){
        e.preventDefault();

        for(var i = 0; i < this.state.discriminador.length; i++){
            if(this.discriminador === this.state.discriminador[i].nome){
                this.classificacao = this.state.discriminador[i].id;
                this.state.classificacao = this.paciente + " classificado como " + this.state.discriminador[i].cor;
                break;
            }
        }

        const atendimento = {
            paciente: this.idPaciente,
            enfermeiro: this.state.user.id,
            registro: this.registro,
            saturacao: this.saturacao,
            glasgow: this.glasgow,
            tax: this.tax,
            hgt: this.hgt,
            pa: this.pa,
            fc: this.fc,
            temperatura: this.temperatura,
            peso: this.peso,
            discricao: this.discricao,
            fluxograma_discriminador: this.classificacao
        }

        console.log(atendimento);
        axios.post('/api/atendimento/store',atendimento);
    }

    render(){
        return(
            <div className="container-fluid" >
                <div className="row">
                    <div className="col-6">&nbsp;</div>
                    <div className="col-6 text-center">
                        <button className="btn btn-primary" onClick={e => this.classificar(e)} data-toggle="modal" data-target="#classificar">Classificar</button>&nbsp;
                        <button className="btn btn-primary" onClick={e => this.incluir(e)}>Incluir</button>&nbsp;
                        <button className="btn btn-primary">Imprimir</button>&nbsp;
                        <button className="btn btn-primary">Cancelar</button>
                    </div>   
                </div>
                <hr/>
                <div className="formulario"> 
                    <div className="form-group row">
                        <div className="col-6 border-right border-dark">
                            <form>
                                <center><h5>Identificação do Paciente</h5></center>
                                <div className="form-group row">
                                    <label htmlFor="registro" className="col-sm-2 col-form-label"> Registro: </label>
                                    <div className="col-sm-4">
                                        <input onChange={e => this.registro = e.target.value} type="number" className="form-control" id="registro" placeholder="Registro Sonner"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="nome" className="col-sm-2 col-form-label "> Nome: </label>
                                    <div className="col-sm-10">
                                        <input onChange={e => this.nome = e.target.value} type="text" className="form-control text-uppercase" id="nome" placeholder="Nome do paciente"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="mae" className="col-sm-2 col-form-label text-uppercase"> Mãe: </label>
                                    <div className="col-sm-10">
                                        <input onChange={e => this.mae = e.target.value} type="text" className="form-control text-uppercase" id="mae" placeholder="Nome da mãe"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="nascimento" className="col-sm-2 col-form-label"> Nascimento: </label>
                                    <div className="col-sm-5">
                                        <input onChange={e => this.nascimento = e.target.value} type="date" className="form-control" id="nascimento" placeholder="Nascimento"/>
                                    </div>
                                    <div className="col-sm-5">
                                        <button onClick={(e) => this.buscar(e)} className="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">&nbsp;&nbsp;&nbsp;&nbsp; Buscar Paciente &nbsp;&nbsp;&nbsp;&nbsp;</button>
                                    </div>
                                </div>
                                <center><h5>Descrição</h5></center>
                                <div className="form-group row">
                                    <label htmlFor="descricao" className="col-sm-2 col-form-label"> Descrição: </label>
                                    <div className="col-sm-10">
                                        <textarea onChange={e => this.descricao = e.target.value} className="form-control" id="descricao" placeholder="Queixa/Situação"/>
                                    </div>
                                </div>
                            </form> 
                        </div>
                        <div className="col-6 border-left border-dark">
                            <form>
                                <center><h5>Sinais Vitais</h5></center>
                                <div className="form-group row">
                                    <label htmlFor="saturacao" className="col-sm-2 col-form-label"> Saturação: </label>
                                    <div className="col-sm-4">
                                        <input onChange={e => this.saturacao = e.target.value} type="number" className="form-control" id="saturacao" placeholder="Oxigênio"/>
                                    </div>
                                    <label htmlFor="glasgow" className="col-sm-2 col-form-label"> Glasgow: </label>
                                    <div className="col-sm-4">
                                        <input onChange={e => this.glasgow = e.target.value} type="number" className="form-control" id="glasgow" placeholder="Glasgow"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="tax" className="col-sm-2 col-form-label"> Tax: </label>
                                    <div className="col-sm-4">
                                        <input onChange={e => this.tax = e.target.value} type="number" className="form-control" id="tax" placeholder="Tax"/>
                                    </div>
                                    <label htmlFor="hgt" className="col-sm-2 col-form-label"> HGT: </label>
                                    <div className="col-sm-4">
                                        <input onChange={e => this.hgt = e.target.value} type="number" className="form-control" id="hgt" placeholder="HGT"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="pa" className="col-sm-2 col-form-label"> PA: </label>
                                    <div className="col-sm-4">
                                        <input onChange={e => this.pa = e.target.value} type="number" className="form-control" id="pa" placeholder="Pressão Arterial"/>
                                    </div>
                                    <label htmlFor="fc" className="col-sm-2 col-form-label"> FC: </label>
                                    <div className="col-sm-4">
                                        <input onChange={e => this.fc = e.target.value} type="number" className="form-control" id="fc" placeholder="FC"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="temperatura" className="col-sm-2 col-form-label"> Temperatura: </label>
                                    <div className="col-sm-4">
                                        <input onChange={e => this.temperatura = e.target.value} type="number" className="form-control" id="temperatura" placeholder="Temperatura"/>
                                    </div>
                                    <label htmlFor="peso" className="col-sm-2 col-form-label"> Peso: </label>
                                    <div className="col-sm-4">
                                        <input onChange={e => this.peso = e.target.value} type="number" className="form-control" id="peso" placeholder="Peso"/>
                                    </div>
                                </div>
                                <center><h5>Classificação de Risco</h5></center>
                                <div className="form-group row">
                                    <label htmlFor="fluxograma" className="col-sm-2 col-form-label"> Fluxograma: </label>
                                    <div className="col-sm-10">
                                        <input className="form-control" id="fluxograma" list="cbFluxograma"onChange={e => this.preencherDiscriminador(e)} placeholder="Fluxograma"/>
                                        <datalist id="cbFluxograma">   
                                            {
                                                this.state.fluxograma.map(
                                                    row =>
                                                    <option value={row.nome} key={row.id}></option>
                                                )
                                            }
                                        </datalist>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="discriminador" className="col-sm-2 col-form-label"> Discriminador: </label>
                                    <div className="col-sm-10">
                                        <input className="form-control" id="discriminador" list="cbDiscriminador" onChange={e => this.discriminador = e.target.value} placeholder="Discriminador"/>
                                        <datalist id="cbDiscriminador">   
                                            {
                                                this.state.discriminador.map(
                                                    row =>
                                                    <option value={row.nome} key={row.id}></option>
                                                )
                                            }
                                        </datalist>
                                    </div>
                                </div>
                            </form>
                        </div> 
                    </div>
                    <div className="row">
                        <div className="modal fade" id="exampleModalCenter" data-backdrop="static" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl"  role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <div className="container">
                                            <center><h5 className="modal-title" id="exampleModalCenterTitle">Selecionar Paciente</h5></center>
                                            <br/>
                                            <form>
                                                <div className="form-group row">
                                                    <label htmlFor="nome" className="col-sm-1 col-form-label"> Nome: </label>
                                                    <div className="col-sm-7">
                                                        <input onChange={e => this.nome = e.target.value} type="text" className="form-control text-uppercase" id="nome2" placeholder="Nome do paciente"/>
                                                    </div>
                                                    <label htmlFor="nascimento" className="col-sm-1 col-form-label"> Nascimento: </label>
                                                    <div className="col-sm-3">
                                                        <input onChange={e => this.nascimento = e.target.value} type="date" className="form-control text-uppercase" id="nascimento2" placeholder="Nascimento"/>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="mae" className="col-sm-1 col-form-label"> Mãe: </label>
                                                    <div className="col-sm-7">
                                                        <input onChange={e => this.mae = e.target.value} type="text" className="form-control" id="mae2" placeholder="Nome da mãe"/>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <button onClick={(e) => this.buscar(e)} className="btn btn-primary col-sm-12" > Buscar </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div> 
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body table-responsive" >
                                        <table className="table table-striped" style={{textAlign: 'left'}}>
                                            <thead>
                                                <tr scope="row">
                                                    <th scope="col"> Nome </th>
                                                    <th scope="col"> Mãe </th>
                                                    <th scope="col"> Nascimento </th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.pacientes.map(
                                                    row=>
                                                    <tr key={row.id}>
                                                        <td> {row.nome} </td>
                                                        <td> {row.mae} </td>
                                                        <td> {row.nascimento} </td>
                                                        <td><button className="btn btn-warning">Alterar</button>{" "}<button className="btn btn-primary" data-dismiss="modal" onClick = {e => this.selecionar(row)}>Selecionar</button></td>       
                                                    </tr>
                                                    )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="modal-footer">
                                        <div className="d-flex justify-content-center">
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
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                                        <button type="button" className="btn btn-primary" data-dismiss="modal"  data-toggle="modal" data-target=".bd-example-modal-lg">Cadastrar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <CaPaciente paciente={{
                            nome: document.getElementById('nome'), 
                            mae: document.getElementById('mae'),
                            nascimento: document.getElementById('nascimento')}}
                        />
                        <div className="modal fade" id="classificar" data-backdrop="static" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl"  role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <center><h5 className="modal-title" id="exampleModalCenterTitle"> Classificação </h5></center>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        {
                                            this.state.classificacao
                                        }
                                    </div>
                                    <div className="modal-footer">
                                        <button className="btn btn-secondary">Fechar</button>
                                    </div>
                                </div>  
                            </div>
                         </div>         
                    </div> 
                </div>
                <hr className="border-4"/>
                <div align="right">
                    <button className="btn btn-primary" > Incluir </button>&nbsp;
                </div>
            </div>
        );
    }
}