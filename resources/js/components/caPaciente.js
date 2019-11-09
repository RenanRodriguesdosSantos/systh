import React,{Component} from 'react';
import axios from 'axios';
import validar from './validacao/validacao';

export default class CaPaciente extends Component{
    constructor(props){
        super(props);
        this.state = {municipios: [], bairros: [], etnias: [], tiposlogradouro: [], paciente: {municipio: "Teófilo Otoni-MG",naturalidade: "Teófilo Otoni-MG",tipoLogradouro: 'Rua'}};
        this.listar();
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e){
        var paciente = this.state.paciente;
        var newValue = e.target.value;
        var campo = e.target.id;
        var oldValue = paciente[campo];
        newValue = newValue.toUpperCase();
        var tipo;
        if(campo == "numero"){
            tipo = 'int';
        }
        else if(campo == 'nascimento'){
            tipo = 'date';
        }
        else{
            tipo = 'text';
        }
        paciente[campo] = validar(tipo, newValue, oldValue);

        this.setState({
            paciente: paciente
        });
    }
    listar(){ // Busca no Banco de dados os dados para ComboBox
        axios.get("http://systh/api/municipio")
        .then((response)=> {this.setState({municipios: response.data})});

        axios.get('http://systh/api/bairro')
        .then((response) => {this.setState({bairros: response.data})});

        axios.get('http://systh/api/etnia')
        .then((response) => {this.setState({etnias: response.data})});

        axios.get('http://systh/api/tipologradouro')
        .then((response) => {this.setState({tiposlogradouro: response.data})});
    }

    salvar(e){
        e.preventDefault();

        //Para tranformar o nome em id para salvar no banco
        for(var i = 0; i < this.state.bairros.length; i++){
            if(this.state.paciente.bairro == this.state.bairros[i].nome){
                this.state.paciente.bairro = this.state.bairros[i].id;
                break;
            }
        }

        //Para tranformar o nome em id para salvar no banco
        for(var i = 0; i < this.state.municipios.length; i++){
            if(this.state.paciente.municipio == (this.state.municipios[i].nome + '-' + this.state.municipios[i].uf)){
                this.state.paciente.municipio = this.state.municipios[i].id;
            }
            if(this.state.paciente.naturalidade == this.state.municipios[i].nome + '-' + this.state.municipios[i].uf){
                this.state.paciente.naturalidade = this.state.municipios[i].id;
            }
        }

        //Para tranformar o nome em id para salvar no banco
        for(var i = 0; i < this.state.tiposlogradouro.length; i++){
            if(this.state.paciente.tipoLogradouro == this.state.tiposlogradouro[i].nome){
                this.state.paciente.tipoLogradouro = this.state.tiposlogradouro[i].id;
                break;
            }
        }

        //Para tranformar o nome em id para salvar no banco
        for(var i = 0; i < this.state.etnias.length; i++){
            if(this.state.paciente.etnia == this.state.etnias[i].nome){
                this.state.paciente.etnia = this.state.etnias[i].id;
                break;
            }
        }

        const paciente = {
            nome: this.state.paciente.nome,
            mae: this.state.paciente.mae,
            nascimento: this.state.paciente.nascimento,
            etnia: this.state.paciente.etnia,
            naturalidade: this.state.paciente.naturalidade,
            profissao: this.state.paciente.profissao,
            tipoLogradouro: this.state.paciente.tipoLogradouro,
            logradouro: this.state.paciente.logradouro,
            numero: this.state.paciente.numero,
            complemento: this.state.paciente.complemento,
            municipio: this.state.paciente.municipio,
            bairro: this.state.paciente.bairro
        };

        console.log(paciente)
        //seta os campos da  tela de atendimento
        this.props.setarCampos(paciente);


        
        axios.post('/api/paciente/store',paciente)
        // .then(response => {this.props.paciente.id = response.data})
        .then(response => console.log(response));
        document.getElementById('form').reset();
    }

    render(){
        return(
                <div>
                    <div className="row">
                        <div className="modal fade bd-example-modal-lg" data-backdrop="static" id="modal2" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalCenterTitle">Cadastro de Pacientes</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body" >
                                        <nav>
                                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                                <a className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Dados Pessoais</a>
                                                <a className="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Endereço</a>
                                            </div>
                                        </nav>
                                        <form id="form">
                                            <div className="tab-content" id="nav-tabContent">
                                                <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                                                    <div className="container">
                                                        <div className="form-group row">
                                                            <label htmlFor="nome" className="col-sm-2 col-form-label"> Nome: </label>
                                                            <div className="col-sm-10">
                                                                <input onChange={this.handleChange} value={this.state.paciente.nome} type="text" className="form-control text-uppercase" id="nome" name="nome" placeholder="Nome do paciente"/>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label htmlFor="mae" className="col-sm-2 col-form-label"> Mãe: </label>
                                                            <div className="col-sm-10">
                                                                <input onChange={this.handleChange} value={this.state.paciente.mae} type="text" className="form-control text-uppercase" id="mae" placeholder="Nome da mãe"/>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label htmlFor="nascimento" className="col-sm-2 col-form-label"> Nascimento: </label>
                                                            <div className="col-sm-5">
                                                                <input onChange={this.handleChange} value={this.state.paciente.nascimento} type="date" className="form-control" id="nascimento" placeholder="Nascimento"/>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label htmlFor="etnia" className="col-sm-2 col-form-label"> Etnia: </label>
                                                            <div className="col-sm-10">
                                                            <input className="form-control" id="etnia" list="cbEtnia" onChange={e => this.state.paciente.etnia = e.target.value} placeholder="Etnia"/>
                                                                <datalist id="cbEtnia">   
                                                                        {
                                                                            this.state.etnias.map(
                                                                                row =>
                                                                                <option key={row.id} value={row.nome}/>           
                                                                            )
                                                                        }
                                                                </datalist>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label htmlFor="naturalidade" className="col-sm-2 col-form-label"> Naturalidade: </label>
                                                            <div className="col-sm-10">
                                                                <input className="form-control" id="naturalidade" onChange={this.handleChange} value={this.state.paciente.naturalidade} defaultValue="Teófilo Otoni-MG" list="cbNaturalidade"onChange={e => this.state.paciente.naturalidade = e.target.value} placeholder="Naturalidade"/>
                                                                <datalist id="cbNaturalidade">   
                                                                        {
                                                                            this.state.municipios.map(
                                                                                row =>
                                                                                <option key={row.id} value={row.nome + '-' + row.uf}/>           
                                                                            )
                                                                        }
                                                                </datalist>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label htmlFor="profissao" className="col-sm-2 col-form-label"> Profissão: </label>
                                                            <div className="col-sm-10">
                                                                <input onChange={this.handleChange} value={this.state.paciente.profissao} type="text" className="form-control text-uppercase" id="profissao" placeholder="Profissão/Ocupação"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                                                    <div className="container">
                                                        <div className="form-group row">
                                                            <label htmlFor="tipologradouro" className="col-sm-3 col-form-label"> Tipo Logradouro: </label>
                                                            <div className="col-sm-9">
                                                                <input className="form-control" id="tipologradouro" onChange={this.handleChange} value={this.state.paciente.tipologradouro} list="cbTipoLogradouro" defaultValue="Rua" onChange={e => this.tipoLogradouro = e.target.value}/>
                                                                <datalist id="cbTipoLogradouro">   
                                                                    {
                                                                        this.state.tiposlogradouro.map(
                                                                            row => 
                                                                                <option key={row.id} value={row.nome}/>
                                                                        )
                                                                    }         
                                                                </datalist>
                                                            </div> 
                                                        </div>
                                                        <div className="form-group row">
                                                            <label htmlFor="logradouro" className="col-sm-3 col-form-label"> Logradouro: </label>
                                                            <div className="col-sm-9">
                                                                <input onChange={this.handleChange} value={this.state.paciente.logradouro} type="text" className="form-control" id="logradouro" placeholder="Logradouro"/>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label htmlFor="numero" className="col-sm-3 col-form-label"> Número: </label>
                                                            <div className="col-sm-5">
                                                                <input onChange={this.handleChange} value={this.state.paciente.numero} type="number" className="form-control" id="numero" placeholder="Número da residência"/>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label htmlFor="complemento" className="col-sm-3 col-form-label"> Complemento: </label>
                                                            <div className="col-sm-9">
                                                                <input onChange={this.handleChange} value={this.state.paciente.complemento} type="text" className="form-control" id="complemento" placeholder="Complemento"/>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label htmlFor="municipio"  className="col-sm-3 col-form-label"> Município: </label>
                                                            <div className="col-sm-9">
                                                                <input className="form-control" id="municipio" defaultValue="Teófilo Otoni-MG" list="cbMunicipio" onChange={e => this.state.paciente.municipio = e.target.value} placeholder="Município"/>
                                                                <datalist ref="cb" id="cbMunicipio" >   
                                                                    {
                                                                        this.state.municipios.map(
                                                                            row =>
                                                                            <option key={row.id} value = {row.nome + '-' + row.uf}/>           
                                                                        )
                                                                    }
                                                                </datalist>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label htmlFor="bairro" className="col-sm-3 col-form-label"> Bairro: </label>
                                                            <div className="col-sm-9">
                                                                <input className="form-control" id="bairro" list="cbBairro" onChange={e => this.state.paciente.bairro = e.target.value} placeholder="Bairro"/>
                                                                <datalist id="cbBairro">
                                                                {
                                                                    this.state.bairros.map(
                                                                        row =>
                                                                        <option key={row.id} value = {row.nome}/>           
                                                                    )
                                                                }
                                                                </datalist>   
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button data-dismiss="modal" className="btn btn-warning" > Cancelar </button>
                                        <button onClick={(e) => this.salvar(e)} className="btn btn-primary" data-dismiss="modal"> Confirmar </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>  
                </div>  
        );
    }
}