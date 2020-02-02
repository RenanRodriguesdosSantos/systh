import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import axios from 'axios';
import Atendimento from './atendimento';
import Home from './home';
import Atendimentos from './atendimentos';
import Header from './header';
import Ajuda from './ajuda';
import User from './user';
import Footer from './footer';
import Adminstrador from './administrador';

export default class App extends Component {
    render(){
        return (
            <Router>
                <Header/>
                <div className="container-fluid text-uppercase"> 
                    <div className="row">
                        <div className="col-md-12 border border-dark pt-2">
                            <Route exact path="/home" component={Home}/>
                            <Route exact path="/atendimento" component={Atendimento}/>
                            <Route exact path="/atendimentos" component={Atendimentos}/>
                            <Route exact path="/ajuda" component={Ajuda}/>
                            <Route exact path="/administrador" component={Adminstrador}/>
                        </div>
                    </div>
                </div>
                <Footer/>
            </Router>
        );
    }
}

if (document.getElementById('systh')) {
    ReactDOM.render(<App />, document.getElementById('systh'));
}

