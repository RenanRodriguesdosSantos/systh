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
                <div className="container-fluid"> 
                    <div className="row">
                        <div className="col-2 border border-dark pr-0">
                            <User/>
                        </div>
                        <div className="col-10 border border-dark pl-0 pt-2 pb-2">
                            <Route exact path="/home" component={Home}/>
                            <Route exact path="/atendimento" component={Atendimento}/>
                            <Route exact path="/atendimentos" component={Atendimentos}/>
                            <Route exact path="/ajuda" component={Ajuda}/>
                            <Route exact path="/administrador" component={Adminstrador}/>
                        </div>
                    </div>
                    <div className="row border-top border-dark">
                        <Footer/>
                    </div>
                </div>
            </Router>
        );
    }
}

if (document.getElementById('systh')) {
    ReactDOM.render(<App />, document.getElementById('systh'));
}

