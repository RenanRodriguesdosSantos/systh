import React,{Component} from 'react';
import axios from 'axios';
import UserIcone from '../imagens/usuarioEnfermagem.png';

export default class User extends Component{
    constructor(){
        super();
        this.state = {user: []};
        axios.get("http://systh/user")
        .then(response => {this.setState({user: response.data})});
    }
    render(){
        return(
            <div className="text-center align-middle">
                <br/>
                <div>
                    <img className="img-fluid" src={UserIcone}/>
                    <h6>{this.state.user.name}</h6>
                    {this.state.user.coren}
                </div>
                <br/>
                <div>
                    <button className="btn btn-secondary" data-toggle="modal" data-target="#ModalLongoExemplo">Alterar senha</button><br/><br/>
                </div>
                <hr/>
                <div style={{background: '#ff0000'}} className="p-1 pt-2">
                    <h5>Vermelho - 0 min</h5>
                </div>
                <div style={{background: '#ff8c00'}} className="p-1 pt-2">
                    <h5>Laranja - 10 min</h5>
                </div>
                <div style={{background: '#ffff00'}} className="p-1 pt-2">
                    <h5>Amarelo - 60 min</h5>
                </div>
                <div style={{background: '#008000'}} className="p-1 pt-2">
                    <h5>Verde - 120 min</h5>
                </div>
                <div style={{background: '#0000ff'}} className="p-1 pt-2">
                    <h5>Azul - 240 min</h5>
                </div>
                <div className="modal fade" id="ModalLongoExemplo" data-backdrop="static" tabIndex="-1" role="dialog" aria-labelledby="TituloModalLongoExemplo" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="TituloModalLongoExemplo">Alterar Senha</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Fechar">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        <div className="modal-body row">
                            <form className="col-md-12 text-left">
                                <div className="form-group row">
                                    <label htmlFor="senhaAtual" className="col-sm-4 col-form-label"> Senha Atual: </label>
                                    <div className="col-sm-8">
                                        <input onChange={this.handleChange} type="password" className="form-control" id="senhaAtual" placeholder="Senha Atual"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="novaSenha" className="col-sm-4 col-form-label"> Nova Senha: </label>
                                    <div className="col-sm-8">
                                        <input onChange={this.handleChange} type="password" className="form-control" id="novaSenha" placeholder="Nova Senha"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="confirmarSenha" className="col-sm-4 col-form-label"> Confirmar Senha: </label>
                                    <div className="col-sm-8">
                                        <input onChange={this.handleChange} type="password" className="form-control" id="confirmarSenha" placeholder="Confirmar Senha"/>
                                    </div>
                                </div>
                            </form>
                        </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Fechar</button>
                                <button type="button" className="btn btn-primary">Salvar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}