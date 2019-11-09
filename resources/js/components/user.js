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
                    <img src={UserIcone}/>
                    <h6>{this.state.user.name}</h6>
                </div>
                <br/>
                <div>
                    <button className="btn btn-secondary">Alterar senha</button><br/><br/>
                </div>
                <br/>
                <hr/>
                <div style={{background: '#ff0000'}} className="p-1 pt-2 m-0 mr-2">
                    <h4>Vermelho - 0 min</h4>
                </div>
                <div style={{background: '#ff8c00'}} className="p-1 pt-2 m-0 mr-2">
                    <h4>Laranja - 10 min</h4>
                </div>
                <div style={{background: '#ffff00'}} className="p-1 pt-2 m-0 mr-2">
                    <h4>Amarelo - 60 min</h4>
                </div>
                <div style={{background: '#008000'}} className="p-1 pt-2 m-0 mr-2">
                    <h4>Verde - 120 min</h4>
                </div>
                <div style={{background: '#0000ff'}} className="p-1 pt-2 m-0 mr-2">
                    <h4>Azul - 240 min</h4>
                </div>
            </div>
        );
    }
}