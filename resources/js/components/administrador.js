import React,{Component} from 'react';
import axios from 'axios';

export default class Adminstrador  extends Component{
    constructor(){
        super();
        this.state = {user: [], fluxograma: [], discriminador: []};
        axios.get("http://systh/user")
        .then(response => {this.setState({user: response.data})});
        this.preecher();
    }

    preecher(){
        axios.get("/api/fluxograma")
        .then(response => {this.setState({fluxograma: response.data})});
        axios.get("/api/discriminador")
        .then(response => {this.setState({discriminador: response.data})});
    }

    salvarFluxograma(e){
        e.preventDefault();
        var fluxograma = {
            nome: this.fluxograma
        }
        axios.post("/api/fluxograma/store",fluxograma)
    }

    salvarDiscriminador(e){
        e.preventDefault();
        var discriminador = {
            nome: this.discriminador
        }
        axios.post("/api/discriminador/store",discriminador);
    }
    
    salvarClassificacao(e){
        e.preventDefault();
        for(var i = 0; i < this.state.fluxograma.length; i++){
            if(this.fluxogramaD == this.state.fluxograma[i].nome){
                this.fluxogramaD = this.state.fluxograma[i].id;
                break;
            }
        }

        for(var i = 0; i < this.state.discriminador.length; i++){
            if(this.discriminadorF == this.state.discriminador[i].nome){
                this.discriminadorF = this.state.discriminador[i].id;
                break;
            }
        }

        var fluxogramaDiscriminador ={
            fluxograma: this.fluxogramaD,
            discriminador: this.discriminadorF,
            cor: this.cor
        }

        axios.post("/api/fluxograma/discriminador/store",fluxogramaDiscriminador);
    }

    render(){
        if(this.state.user.id === 1){
            return(
                <div>
                    <h1>Adminstrador</h1>
                    <div className="container-fluid formulario"> 
                        <div className="form-group row">
                            <div className="col-6 border-right border-dark">
                                <form>
                                    <div className="form-group row">
                                        <label htmlFor="fluxograma" className="col-sm-2 col-form-label"> Fluxograma: </label>
                                        <div className="col-sm-10">
                                            <input onChange={e => this.fluxograma = e.target.value} type="text" className="form-control" id="fluxograma" placeholder="Fluxograma"/>
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
                                            <input onChange={e => this.discriminador = e.target.value} type="text" className="form-control" id="discriminador" placeholder="Discriminador"/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-12 text-right">
                                            <button className="btn btn-primary" onClick={e => this.salvarDiscriminador(e)}>Salvar Discriminador</button>
                                        </div>
                                    </div>
                                    <div className="border border-dark">
                                        <div className="form-group row">
                                            <label htmlFor="fluxogramaD" className="col-sm-2 col-form-label"> Fluxograma: </label>
                                            <div className="col-sm-10">
                                                <input className="form-control" id="fluxogramaD" list="cbFluxograma" onChange={e => this.fluxogramaD = e.target.value} placeholder="Fluxograma"/>
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
                                            <label htmlFor="discriminiadorF" className="col-sm-2 col-form-label"> Discriminador: </label>
                                            <div className="col-sm-10">
                                                <input className="form-control" id="discriminiadorF" list="cbDiscriminador" onChange={e => this.discriminadorF = e.target.value} placeholder="Discriminador"/>
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
                                        <div className="form-group row">
                                            <label htmlFor="cor" className="col-sm-2 col-form-label"> Cor: </label>
                                            <div className="col-sm-10">
                                                <input onChange={e => this.cor = e.target.value} type="text" className="form-control" id="cor" placeholder="Cor"/>
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
                        </div>
                    </div>
                </div>
            );
        }
        else{
            return(<div><h1>404 | Not Found</h1></div>);
        }
    }
}