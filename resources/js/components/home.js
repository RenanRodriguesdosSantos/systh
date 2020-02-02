import React,{Component} from 'react';
import Triagem from '../imagens/info.png';

export default class Home extends Component{
    render(){
        return(
            <div>
                <img className="img-fluid" src={Triagem}/>
            </div>
        );
    }
}