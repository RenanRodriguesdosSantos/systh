import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import Logo from '../imagens/logo.png';

export default class Header extends Component{
    constructor(){
        super();
    }
    
    sair(e){
        e.preventDefault();
        document.getElementById('logout-form').submit();
    }

    render(){
        return(
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <Link className="navbar-brand nav-link mr-5" to="/home"><img src={Logo} />Skalp</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <Link className="nav-link" to="/home"><div id="home">Home</div><span className="sr-only">(current)</span></Link>
                            </li>
                            <li className="nav-item active">
                                <Link className="nav-link" to="/atendimento" ><div id="home">Atendimento</div><span className="sr-only">(current)</span></Link>
                            </li>
                            <li className="nav-item active">
                                <Link className="nav-link" to="/atendimentos"><div id="home">Relatórios</div><span className="sr-only">(current)</span></Link>
                            </li>
                            <li className="nav-item active">
                                <Link className="nav-link" to="/ajuda"><div id="home">Ajuda</div><span className="sr-only">(current)</span></Link>
                            </li>
                        </ul>
                        <button className="btn btn-outline-success my-2 my-sm-0" onClick={e => this.sair(e)}>Sair</button>
                        <form id="logout-form" action="/sair" method="GET" hidden>
                        </form>
                                  
                    </div>
                </nav>
            </div>
        );
    }
    
}
