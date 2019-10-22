import React,{Component} from 'react';
import Triagem from '../imagens/info.png';

export default class Home extends Component{
    render(){
        return(
            <div className="w-100 h-100">
                <img src={Triagem}/>
            </div>
        );
    }
}