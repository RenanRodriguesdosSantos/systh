import React,{Component} from 'react';
import axios from 'axios';
import validar from './validacao/validacao';

export default class Adminstrador  extends Component{
    constructor(){
        super();
        this.state = {
            user: [], 
            fluxogramas: [], 
            discriminadores: [], 
            cor: "VERMELHO", 
            fluxograma: "", 
            discriminador: "", 
            fluxogramaD: "", 
            discriminadorF: "",
            nome: "",
            email: "",
            coren: "",
            senha: "",
            confirmar: ""
        };
        axios.get("http://systh/user")
        .then(response => {this.setState({user: response.data})});
        this.preecher();
        this.handleSelect = this.handleSelect.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSelect(e){
        var campo = e.target.id;
        var value = e.target.value;
        value = value.toUpperCase();
        if(campo == 'cor'){
            this.setState({cor: value})
        }
        else if(campo == "fluxogramaD"){
            this.setState({fluxogramaD: value});
        }
        else if(campo == "discriminadorF"){
            this.setState({discriminadorF: value});
        }
    }

    handleChange(e){
        var campo = e.target.id;
        var value = e.target.value;

        if(campo == "fluxograma"){
            this.setState({fluxograma: validar("text",value.toUpperCase(),this.state.fluxograma)});
        }
        else if(campo == "discriminador"){
            this.setState({discriminador: validar("text",value.toUpperCase(),this.state.discriminador)});
        }
        else if(campo == "nome"){
            this.setState({nome: validar("text",value.toUpperCase(),this.state.nome)})
        }
        else if(campo == "coren"){
            this.setState({coren: validar("int",value,this.state.coren)})
        }
        else if(campo == "email"){
            this.setState({email: validar("livre",value,this.state.email)})
        }
        else if(campo == "senha"){
            this.setState({senha: validar("livre",value,this.state.senha)})
        }
        else if(campo == "confirmar"){
            this.setState({confirmar: validar("livre",value,this.state.confirmar)})
        }
    }

    preecher(){
        axios.get("/api/fluxograma")
        .then(response => {this.setState({fluxogramas: response.data})});
        axios.get("/api/discriminador")
        .then(response => {this.setState({discriminadores: response.data})});
    }

    salvarFluxograma(e){
        e.preventDefault();
        if(!this.state.fluxograma){
            alert("Preencha o campo Fluxograma");
        }
        else{
            var fluxograma = {
                nome: this.state.fluxograma
            }
            axios.post("/api/fluxograma/store",fluxograma)
            .then(e => {
                axios.get("/api/fluxograma")
                .then(response => {this.setState({fluxogramas: response.data})});
            });
            this.setState({fluxograma: ""});
        }
    }

    salvarDiscriminador(e){
        e.preventDefault();
        
        if(!this.state.discriminador){
            alert("Preencha o campo Discriminador");
        }
        else{
            var discriminador = {
                nome: this.state.discriminador
            }
            axios.post("/api/discriminador/store",discriminador)
            .then(e => {  
                axios.get("/api/discriminador")
                .then(response => {this.setState({discriminadores: response.data})});
            });
            this.setState({discriminador: ""});
        }
    }
    
    salvarClassificacao(e){
        e.preventDefault();
        var fluxograma = this.state.fluxogramaD;
        var discriminador = this.state.discriminadorF;
        for(var i = 0; i < this.state.fluxogramas.length; i++){
            if(fluxograma == this.state.fluxogramas[i].nome){
                fluxograma = this.state.fluxogramas[i].id;
                break;
            }
        }

        for(var i = 0; i < this.state.discriminadores.length; i++){
            if(discriminador == this.state.discriminadores[i].nome){
                discriminador = this.state.discriminadores[i].id;
                break;
            }
        }

        var fluxogramaDiscriminador ={
            fluxograma: fluxograma,
            discriminador: discriminador,
            cor: this.state.cor
        }
    
        if(typeof fluxogramaDiscriminador.fluxograma === "number" && typeof fluxogramaDiscriminador.discriminador === "number"){
            axios.post("/api/fluxograma/discriminador/store",fluxogramaDiscriminador);
            this.setState({fluxogramaD: "", discriminadorF: ""});
        }
        else{
            alert("Selecione um Fluxograma e um Discriminador")
        }
    }

    registrarUsuario(e){
        e.preventDefault();
        var enfermeiro = {name: this.state.nome, coren: this.state.coren, email: this.state.email, password: this.state.senha};
        
        if(enfermeiro.name == "" || enfermeiro.coren == "" || enfermeiro.email == "" || enfermeiro.password == ""){
            alert("Preencha todos os campos");
        }
        else{
            if(enfermeiro.password == this.state.confirmar){
                axios.post("/api/register",enfermeiro);
                this.setState({nome: "", coren: "", email: "", senha: "", confirmar: ""});
            }
            else{
                alert("Senhas diferentes!")
            }
        }
    }

    render(){
        return(
            <div>
                <h4>Adminstrador</h4>
                <div className="container-fluid formulario"> 
                    <div className="form-group row">
                        <div className="col-md-6 border border-dark">
                            <form>
                                <div className="form-group row">
                                    <label htmlFor="fluxograma" className="col-sm-2 col-form-label"> Fluxograma: </label>
                                    <div className="col-sm-10">
                                        <input onChange={this.handleChange} value={this.state.fluxograma} type="text" className="form-control text-uppercase" id="fluxograma" placeholder="Fluxograma"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-sm-12 text-right">
                                        <button className="btn btn-primary" onClick={e => this.salvarFluxograma(e)}>Salvar Fluxograma</button>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="discriminador" className="col-sm-2 col-form-label"> Discriminador: </label>
                                    <div className="col-sm-10">
                                        <input onChange={this.handleChange} value={this.state.discriminador} type="text" className="form-control text-uppercase" id="discriminador" placeholder="Discriminador"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-sm-12 text-right">
                                        <button className="btn btn-primary" onClick={e => this.salvarDiscriminador(e)}>Salvar Discriminador</button>
                                    </div>
                                </div>
                                <div className="border border-dark p-2">
                                    <div className="form-group row">
                                        <label htmlFor="fluxogramaD" className="col-sm-2 col-form-label"> Fluxograma: </label>
                                        <div className="col-sm-10">
                                            <input className="form-control text-uppercase" id="fluxogramaD" list="cbFluxograma" onChange={this.handleSelect} value={this.state.fluxogramaD} placeholder="Fluxograma"/>
                                            <datalist id="cbFluxograma">   
                                                {
                                                    this.state.fluxogramas.map(
                                                        row =>
                                                        <option value={row.nome} key={row.id}></option>
                                                    )
                                                }
                                            </datalist>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="discriminadorF" className="col-sm-2 col-form-label"> Discriminador: </label>
                                        <div className="col-sm-10">
                                            <input className="form-control text-uppercase" id="discriminadorF" list="cbDiscriminador" onChange={this.handleSelect} value={this.state.discriminadorF} placeholder="Discriminador"/>
                                            <datalist id="cbDiscriminador">   
                                                {
                                                    this.state.discriminadores.map(
                                                        row =>
                                                        <option value={row.nome} key={row.id}></option>
                                                    )
                                                }
                                            </datalist>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="cor" className="col-sm-2 col-form-label"> Cor: </label>
                                        <div className="col-sm-10">
                                            <select className="form-control custom-select my-1 mr-sm-2" id="cor" placeholder="Cor" onChange={this.handleSelect} value={this.state.cor}>
                                                <option value="VERMELHO">VERMELHO</option>
                                                <option value="LARANJA">LARANJA</option>
                                                <option value="AMARELO">AMARELO</option>
                                                <option value="VERDE">VERDE</option>
                                                <option value="AZUL">AZUL</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-12 text-right">
                                            <button className="btn btn-primary" onClick={e => this.salvarClassificacao(e)}>Salvar Classificação</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="col-md-6 border border-dark">
                            <form>
                                <div className="form-group row">
                                    <label htmlFor="nome" className="col-md-2 col-form-label ">Nome:</label>
                                    <div className="col-md-10">
                                        <input id="nome" type="text" className="form-control text-uppercase" onChange={this.handleChange} value={this.state.nome} placeholder="Nome"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="coren" className="col-md-2 col-form-label ">Coren:</label>
                                    <div className="col-md-10">
                                        <input id="coren" type="text" className="form-control" onChange={this.handleChange} value={this.state.coren} placeholder="Coren"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="email" className="col-md-2 col-form-label ">E-Mail:</label>
                                    <div className="col-md-10">
                                        <input id="email" type="email" className="form-control" name="email" onChange={this.handleChange} value={this.state.email} placeholder="E-mail"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="senha" className="col-md-2 col-form-label ">Senha</label>
                                    <div className="col-md-10">
                                        <input id="senha" type="password" className="form-control" onChange={this.handleChange} value={this.state.senha} placeholder="Senha"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="confirmar" className="col-md-2 col-form-label ">Confirmar Senha</label>
                                    <div className="col-md-10">
                                        <input id="confirmar" type="password" className="form-control" onChange={this.handleChange} value={this.state.confirmar} placeholder="Confirmar Senha"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-12 text-right">
                                        <button onClick={e => this.registrarUsuario(e)} className="btn btn-primary">
                                            Registrar
                                        </button>
                                    </div>
                                </div>
                            </form>  
                        </div>
                    </div>
                </div>    
            </div>
        );
    }
}