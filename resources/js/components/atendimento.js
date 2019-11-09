import React, {Component} from 'react';
import axios from 'axios';
import Pagination from 'react-js-pagination';
import Brasao from '../imagens/brasao.png';
import Upa from '../imagens/upa.png';
import Logomini from '../imagens/logomini.png';
import validar from './validacao/validacao';
import Edit from '../imagens/edit.png';
import Selecionar from '../imagens/accept.png';

export default class Atendimento extends Component{
    constructor(props){
        super(props);
        this.state = {  
                        pacientes: [],
                        fluxograma: [], 
                        discriminador: [],
                        user: [],
                        classificacao: "Cor",
                        activePage:0,
                        itemsCountPerPage:0,
                        totalItemsCount:0,
                        atendimento: this.props.location.state?this.props.location.state.atendimento:[],
                        cor: '',
                        municipios: [], 
                        bairros: [], 
                        etnias: [], 
                        tiposlogradouro: [], 
                        paciente: {municipio: "Teófilo Otoni-MG",naturalidade: "Teófilo Otoni-MG",tipoLogradouro: 'Rua'}
                    };

        this.handleChange = this.handleChange.bind(this);
                
        axios.get("http://systh/user")
        .then(response => {this.setState({user: response.data})})
        this.preencherFluxograma();
    }

    handleChange(e){
        var atendimento = this.state.atendimento;
        var newValue = e.target.value;
        var campo = e.target.id;
        var oldValue = atendimento[campo];
        newValue = newValue.toUpperCase();
        var tipo;
        if(campo == "registro" || campo == 'numero'){
            tipo = 'int';
        }
        else if(campo == 'saturacao' || campo == 'glasgow' || campo == 'tax' || campo == 'hgt' || campo == 'fc' || campo == 'pa' || campo == 'peso' || campo == 'temperatura'){
            tipo = 'float';
        }
        else if(campo == 'nascimento'){
            tipo = 'date';
        }
        else{
            tipo = 'text';
        }

        if(campo == 'nome' || campo == 'nascimento' || campo == 'mae' || campo == 'numero' || campo == 'profissao' || campo == 'complemento' || campo == 'logradouro'){
            var paciente = this.state.paciente;
            paciente[campo] = validar(tipo, newValue, oldValue);
            this.setState({
                paciente: paciente
            });
        }
        else{
            atendimento[campo] = validar(tipo, newValue, oldValue);
            this.setState({
                atendimento: atendimento
            });
        }
    }

    setAtendimento(nome,mae,nascimento){
        var atendimento = this.state.atendimento;
        atendimento.nome = nome;
        atendimento.mae = mae;
        atendimento.nascimento = nascimento;
        this.setState({atendimento: atendimento});
    }

    handlePageChange(pageNumber){
        const pacientes = {
            nome: this.nome,
            mae: this.mae,
            nascimento: this.nascimento
        }
        axios.post("http://systh/api/paciente?page="+pageNumber,pacientes)
        .then(response=>{
            this.setState({
                pacientes: response.data.data,
                activePage: response.data.current_page,
                itemsCountPerPage: response.data.per_page,
                totalItemsCount: response.data.total
            })
        })
    }

    preencherFluxograma(){ // Busca no Banco os dados para preenchimento do ComboBox Fluxograma;
        axios.get("http://systh/api/fluxograma")
        .then(response => {this.setState({fluxograma: response.data})});
    }

    //obtem o código do fluxograma e preenche o combobox do discriminador
    fluxograma(e){
        this.fluxograma = e.target.value;
        for(var i = 0; i < this.state.fluxograma.length; i++){
            if(this.fluxograma == this.state.fluxograma[i].nome){
                this.fluxograma = this.state.fluxograma[i].id;
                break;
            }
        }
        if(typeof this.fluxograma === "number"){
            axios.get("http://systh/api/discriminador/"+this.fluxograma)
            .then(response => {this.setState({discriminador: response.data})});
        } 
    }

    //obtem o código da classificação
    discriminador(e){
        for(var i = 0; i < this.state.discriminador.length; i++){
            if(e.target.value == this.state.discriminador[i].nome){
                var atendimento = this.state.atendimento;
                atendimento.classificacao = this.state.discriminador[i].id;
                this.setState({atendimento: atendimento});
                this.setState({classificacao: this.state.discriminador[i].cor});
                if(this.state.discriminador[i].cor == "Vermelho"){
                    this.setState({cor: '#ff0000'})
                }
                else if(this.state.classificacao == "Laranja"){
                    this.setState({cor: '#ff8c00'})
                }
                else if(this.state.classificacao == "Amarelo"){
                    this.setState({cor: '#ffff00'})
                }
                else if(this.state.classificacao == "Verde"){
                    this.setState({cor: '#008000'})
                }
                else if(this.state.classificacao == "Azul"){
                    this.setState({cor: '#0000ff'})
                }
                break;
            }
        }
    }

    buscar(e){
        e.preventDefault();
        if(!(!this.state.paciente.nome && !this.state.paciente.mae && !this.state.paciente.nascimento)){
            const pacientes = {
                nome: this.state.paciente.nome,
                mae: this.state.paciente.mae,
                nascimento: this.state.paciente.nascimento
            }
            axios.post('http://systh/api/paciente',pacientes)
            .then(response => {
                this.setState({
                    pacientes: response.data.data,
                    activePage: response.data.current_page,
                    itemsCountPerPage: response.data.per_page,
                    totalItemsCount: response.data.total
                })
            });
        }
        
    }

    selecionar(row){
        var atendimento = this.state.atendimento;
        var paciente = this.state.paciente;
        atendimento.paciente = row.id;
        paciente.nome = row.nome;
        paciente.mae = row.mae;
        paciente.nascimento = row.nascimento;
        this.setState({paciente: paciente, atendimento: atendimento});
    }

    incluir(e){
       e.preventDefault();
        const atendimento = {
            paciente: this.state.atendimento.paciente,
            enfermeiro: this.state.user.id,
            registro: this.state.atendimento.registro,
            saturacao: this.state.atendimento.saturacao,
            glasgow: this.state.atendimento.glasgow,
            tax: this.state.atendimento.tax,
            hgt: this.state.atendimento.hgt,
            pa: this.state.atendimento.pa,
            fc: this.state.atendimento.fc,
            temperatura: this.state.atendimento.temperatura,
            peso: this.state.atendimento.peso,
            discricao: this.state.atendimento.discricao,
            fluxograma_discriminador: this.state.atendimento.classificacao
        }

        console.log(atendimento);
        axios.post('/api/atendimento/store',atendimento);
    }

    imprimir(e){
        e.preventDefault();
        //var table = "";
        var table = "<table><tr class='center'><td><img src='http://systh/images/brasao.png'></td><td colspan='3'><b>PREFEITURA MUNICIPAL DE TEÓFILO OTONI <br> SECRETARIA MUNICIPAL DE SAÚDE <br> Unidade de Pronto Atendimento</b></td><td><img src='images/upa.png'></td></tr>";
        table = table + "<tr class='center'><td colspan='5'><b>SECRETARIA DE ESTADO DE SAÚDE DE MINAS GERAIS</b></td></tr>";
        table = table + "<tr class='center'><td colspan='5'><b>ACOLHIMENTO COM CLASSIFICAÇÃO DE RISCO - SISTEMA DE MANCHESTER</b></td></tr>";
        table = table + "<tr><td colspan='5' bgcolor='C0C0C0'>&nbsp;</td></tr>";
        table = table + "<tr class='center'><td colspan='5' >IDENTIFICAÇÃO DO PACIENTE</td></tr>";
        table = table + "<tr><td colspan='5'>Nome: " + this.nome +" </td></tr>";
        table = table + "<tr><td colspan='2'>Idade: " + this.nascimento +"</td><td colspan='3'>Registro: " + this.registro + "</td></tr>";
        table = table + "<tr><td colspan='5'>Mãe: " + this.mae + " </td></tr>";
        table = table + "<tr><td colspan='2'>Etnia: " + "</td><td colspan='3'>Naturalidade: " + " </td></tr>";
        table = table + "<tr><td colspan='2'>ID: " + "</td><td colspan='3'>Profissão/Ocupação: " + " </td></tr>";
        table = table + "<tr><td colspan='5'>Logradouro: " + "" + " </td></tr>";
        table = table + "<tr><td colspan='2'>Número: " + "</td><td colspan='3'>Complemento: " + " </td></tr>";
        table = table + "<tr><td colspan='2'>Bairro: " + "</td><td colspan='3'>Cidade: " + " </td></tr>";
        table = table + "<tr><td colspan='5' bgcolor='C0C0C0'>&nbsp;</td></tr>";
        table = table + "<tr class='center'><td colspan='5' >CLASSIFICAÇÃO DE RISCO</td></tr>";
        table = table + "<tr><td colspan='5'>Descrição: " + "" + " </td></tr>";
        table = table + "<tr><td colspan='4'>Fluxograma: " + "</td><td>Número: " + " </td></tr>";
        table = table + "<tr><td colspan='5'>Discriminador: " + "" + " </td></tr>";
        table = table + "<tr><td colspan='5' bgcolor='C0C0C0'>&nbsp;</td></tr>";
        table = table + "<tr class='center'><td colspan='5' > SINAIS VITAIS </td></tr>";
        table = table + "<tr><td colspan='2'>Saturação: " + "</td><td colspan='3'>Glasgow: " + " </td></tr>";
        table = table + "<tr><td colspan='2'>TAX: " + "</td><td colspan='3'>HGT: " + " </td></tr>";
        table = table + "<tr><td colspan='2'>PA: " + "</td><td colspan='3'>FC: " + " </td></tr>";
        table = table + "<tr><td colspan='2'>Temperatura: " + "</td><td colspan='3'>Peso: " + " </td></tr>";
        table = table + "<tr><td colspan='5' bgcolor='C0C0C0'>&nbsp;</td></tr>";
        table = table + "<tr class='center'><td colspan='5' > ENFERMEIRO RESPONSÁVEL </td></tr>";
        table = table + "<tr><td colspan='4'>Enfermeiro: " + "</td><td>Coren: " + " </td></tr>";
        table = table + "<tr><td colspan='5'>Coordenador: " + "" + " </td></tr>";
        table = table + "<tr><td colspan='5' class='center'><br><br>_____________________________________________<br> Teófilo Otoni<br> 21:41 <br> 25/10/2019</td></tr>";
        table = table + "</table>"

        var style = "<style> table{width: 100%; font: 17px Calibri;} table,tr,td {border: solid 2px #000000; border-collapse: collapse;} .center{text-align: center;}</style>";
        var head = "<head><title>Atendimento </title> "+ style +" </head>";
        var body = "<body>"+table+"<body>";
        var win = window.open("","","height=700,width=700");
        win.document.write("<html>");
        win.document.write(head);
        win.document.write(body);
        win.document.write("</html>");
        win.print();
        //win.close();
    }

    coverteData(data){
        var dia = data.substring(8,10);
        var mes = data.substring(5,7);
        var ano = data.substring(0,4);
        return (dia + "/" + mes + "/" + ano);
    }

    //set os campos da tela de atendimento de acordo com paciente salvo ou modificado
    setarCampos(paciente){
        var atendimento = this.state.atendimento;
        atendimento.nome = paciente.nome;
        atendimento.mae = paciente.mae;
        atendimento.nascimento = paciente.nascimento;
        this.setState({atendimento: atendimento});
    }

    //cadastar novo paciente
    cadastrar(e){
        e.preventDefault();
        this.listar();
    }

    //////// ====== MÉTODOS UTILIZADOS PARA CADASTRO DE PACIENTE ==========////////

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


        
        axios.post('/api/paciente/store',paciente)
        // .then(response => {this.props.paciente.id = response.data})
        .then(response => console.log(response));
        document.getElementById('form').reset();
    }

    //////// ====== ==== ==== ==== ==== ==== ==== ==== ==== ==== ==========////////

    render(){
        return(
            <div className="container-fluid" >
                <div className="row">
                    <div className="col-6">&nbsp;</div>
                    <div className="col-6 text-center">
                        <button className="btn btn-primary" onClick={e => this.incluir(e)}>Incluir</button>&nbsp;
                        <button className="btn btn-primary" onClick={e => this.imprimir(e)}>Imprimir</button>&nbsp;
                        <button className="btn btn-primary">Cancelar</button>
                    </div>   
                </div>
                <hr/>
                <div className="formulario"> 
                    <div className="form-group row">
                        <div className="col-6 border-right border-dark">
                            <form id="identificacao">
                                <center><h5>Identificação do Paciente</h5></center>
                                <div className="form-group row">
                                    <label htmlFor="registro" className="col-sm-2 col-form-label"> Registro: </label>
                                    <div className="col-sm-4">
                                        <input onChange={this.handleChange} value={this.state.atendimento.registro} type="text" className="form-control" id="registro" placeholder="Registro Sonner"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="nome" className="col-sm-2 col-form-label "> Nome: </label>
                                    <div className="col-sm-10">
                                        <input onChange={this.handleChange} value={this.state.paciente.nome} type="text" className="form-control text-uppercase" id="nome" placeholder="Nome do paciente"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="mae" className="col-sm-2 col-form-label text-uppercase"> Mãe: </label>
                                    <div className="col-sm-10">
                                        <input onChange={this.handleChange} value={this.state.paciente.mae} type="text" className="form-control text-uppercase" id="mae" placeholder="Nome da mãe"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="nascimento" className="col-sm-2 col-form-label"> Nascimento: </label>
                                    <div className="col-sm-5">
                                        <input onChange={this.handleChange} value={this.state.paciente.nascimento} type="date" className="form-control" id="nascimento" placeholder="Nascimento"/>
                                    </div>
                                    <div className="col-sm-5">
                                        <button onClick={(e) => this.buscar(e)} className="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter"> Buscar </button>
                                    </div>
                                </div>
                                <center><h5>Descrição</h5></center>
                                <div className="form-group row">
                                    <label htmlFor="descricao" className="col-sm-2 col-form-label"> Descrição: </label>
                                    <div className="col-sm-10">
                                        <textarea onChange={this.handleChange}  value={this.state.atendimento.descricao} defaultValue="" className="form-control" id="descricao" placeholder="Queixa/Situação"/>
                                    </div>
                                </div>
                            </form> 
                        </div>
                        <div className="col-6 border-left border-dark">
                            <form>
                                <center><h5>Sinais Vitais</h5></center>
                                <div className="form-group row">
                                    <label htmlFor="saturacao" className="col-sm-2 col-form-label"> Saturação: </label>
                                    <div className="col-sm-4">
                                        <input onChange={this.handleChange} value={this.state.atendimento.saturacao} type="text" className="form-control" id="saturacao" placeholder="Oxigênio"/>
                                    </div>
                                    <label htmlFor="glasgow" className="col-sm-2 col-form-label"> Glasgow: </label>
                                    <div className="col-sm-4">
                                        <input onChange={this.handleChange} value={this.state.atendimento.glasgow} type="text" className="form-control" id="glasgow" placeholder="Glasgow"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="tax" className="col-sm-2 col-form-label"> Tax: </label>
                                    <div className="col-sm-4">
                                        <input onChange={this.handleChange} value={this.state.atendimento.tax} type="text" className="form-control" id="tax" placeholder="Tax"/>
                                    </div>
                                    <label htmlFor="hgt" className="col-sm-2 col-form-label"> HGT: </label>
                                    <div className="col-sm-4">
                                        <input onChange={this.handleChange} value={this.state.atendimento.hgt} type="text" className="form-control" id="hgt" placeholder="HGT"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="pa" className="col-sm-2 col-form-label"> PA: </label>
                                    <div className="col-sm-4">
                                        <input onChange={this.handleChange} value={this.state.atendimento.pa} type="text" className="form-control" id="pa" placeholder="Pressão Arterial"/>
                                    </div>
                                    <label htmlFor="fc" className="col-sm-2 col-form-label"> FC: </label>
                                    <div className="col-sm-4">
                                        <input onChange={this.handleChange} value={this.state.atendimento.fc} type="text" className="form-control" id="fc" placeholder="FC"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="temperatura" className="col-sm-2 col-form-label"> Temperatura: </label>
                                    <div className="col-sm-4">
                                        <input onChange={this.handleChange} value={this.state.atendimento.temperatura} type="text" className="form-control" id="temperatura" placeholder="Temperatura"/>
                                    </div>
                                    <label htmlFor="peso" className="col-sm-2 col-form-label"> Peso: </label>
                                    <div className="col-sm-4">
                                        <input onChange={this.handleChange} value={this.state.atendimento.peso} type="text" className="form-control" id="peso" placeholder="Peso"/>
                                    </div>
                                </div>
                                <center><h5>Classificação de Risco</h5></center>
                                <div className="form-group row">
                                    <label htmlFor="fluxograma" className="col-sm-2 col-form-label"> Fluxograma: </label>
                                    <div className="col-sm-10">
                                        <input className="form-control" id="fluxograma" list="cbFluxograma" onChange={e => this.fluxograma(e)} placeholder="Fluxograma"/>
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
                                    <label htmlFor="discriminador" className="col-sm-2 col-form-label"> Discriminador: </label>
                                    <div className="col-sm-10">
                                        <input className="form-control" id="discriminador" list="cbDiscriminador" onChange={e => this.discriminador(e)} placeholder="Discriminador"/>
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
                            </form>
                        </div> 
                    </div>
                    <div className="row">
                        <div className="modal fade" id="exampleModalCenter" data-backdrop="static" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl"  role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <div className="container">
                                            <center><h5 className="modal-title" id="exampleModalCenterTitle">Selecionar Paciente</h5></center>
                                            <br/>
                                            <form>
                                                <div className="form-group row">
                                                    <label htmlFor="nome" className="col-sm-1 col-form-label"> Nome: </label>
                                                    <div className="col-sm-7">
                                                        <input onChange={this.handleChange} value={this.state.paciente.nome} type="text" className="form-control text-uppercase" id="nome" placeholder="Nome do paciente"/>
                                                    </div>
                                                    <label htmlFor="nascimento" className="col-sm-1 col-form-label"> Nascimento: </label>
                                                    <div className="col-sm-3">
                                                        <input onChange={this.handleChange} value={this.state.paciente.nascimento} type="date" className="form-control text-uppercase" id="nascimento" placeholder="Nascimento"/>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="mae" className="col-sm-1 col-form-label"> Mãe: </label>
                                                    <div className="col-sm-7">
                                                        <input onChange={this.handleChange} value={this.state.paciente.mae} type="text" className="form-control text-uppercase" id="mae" placeholder="Nome da mãe"/>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <button onClick={(e) => this.buscar(e)} className="btn btn-primary col-sm-12" > Buscar </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div> 
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body table-responsive" >
                                        <table className="table table-striped" style={{textAlign: 'left'}}>
                                            <thead>
                                                <tr scope="row">
                                                    <th scope="col"> Nome </th>
                                                    <th scope="col"> Mãe </th>
                                                    <th scope="col"> Nascimento </th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.pacientes.map(
                                                    row=>
                                                    <tr key={row.id}>
                                                        <td> {row.nome} </td>
                                                        <td> {row.mae} </td>
                                                        <td> {this.coverteData(row.nascimento)} </td>
                                                        <td><button className="btn btn-warning"><img src={Edit}/></button><button className="btn btn-primary" data-dismiss="modal" onClick = {e => this.selecionar(row)}><img src={Selecionar}/></button></td>       
                                                    </tr>
                                                    )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="modal-footer">
                                        <div className="d-flex justify-content-center col-12">
                                            <Pagination
                                                activePage={this.state.activePage}
                                                itemsCountPerPage={this.state.itemsCountPerPage}
                                                totalItemsCount={this.state.totalItemsCount}
                                                pageRangeDisplayed={5}
                                                onChange={e => this.handlePageChange(e)}
                                                itemClass="page-item"
                                                linkClass="page-link"
                                                />
                                        </div>
                                        <button type="button"  className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                                        <button type="button" onClick={e => this.cadastrar(e)} data-dismiss="modal" className="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg">Cadastrar</button>
                                    </div>
                                </div>
                            </div>
                        </div>  
                    </div>
                    {/* Cadastro de Paciente */} 
                    <div>
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
                <hr className="border-4"/>
                <div className="row text-right m-0">
                    <div  className="col-11 text-right m-0"  ><center><div align="right" className="col-2 border border-dark rounded p-2 text-center m-0" style={{background: this.state.cor}}>&nbsp;{this.state.classificacao}</div></center></div>
                    <div  className="col-1 text-right"><button className="btn btn-primary" > Incluir </button>&nbsp;</div>
                </div>
            </div>
        );
    }
}