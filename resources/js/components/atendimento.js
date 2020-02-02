import React, {Component} from 'react';
import axios from 'axios';
import Pagination from 'react-js-pagination';
import Brasao from '../imagens/brasao.png';
import Upa from '../imagens/upa.png';
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
                        atendimento: this.props.location.state?this.props.location.state.atendimento:{registro: "", saturacao: "",glasgow: "", tax: "", fc: "", pa: "", hgt: "", peso: "", fluxograma: "", discriminador: "", descricao: "",numeroFluxograma: ""},
                        cor: '',
                        municipios: [],
                        etnias: [], 
                        tiposlogradouro: [], 
                        paciente: this.props.location.state?this.props.location.state.paciente:{nome: "", mae: "",nascimento: "",etnia: "" ,municipio: "", bairro: "",naturalidade: "",tipoLogradouro: "", profissao: "", numero: "", logradouro: "", complemento: ""}
                    };

        this.handleChange = this.handleChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.api = "/api";

        axios.get("http://systh/user")
        .then(response => {this.setState({user: response.data})})
        this.preencherFluxograma();
        this.editarAtendimento();

    }

    editarAtendimento(){
        if(this.props.location.state){
            axios.get(this.api + '/fluxograma/discriminador/'+this.props.location.state.atendimento.fluxograma_discriminador)
            .then((response) => {
               var fluxograma_discriminador = response.data[0];
                
                    axios.get(this.api +"/discriminador/"+fluxograma_discriminador.fluxograma)
                    .then((response) => {
                        this.setState({discriminador: response.data});
                    });
                    
                    
                $('#discriminador').prop('disabled',false);
                $('#discriminador').val(fluxograma_discriminador.nomeDiscriminador);
                var atendimento = this.state.atendimento;
                atendimento.numeroFluxograma = fluxograma_discriminador.fluxograma;
                atendimento.discriminador = fluxograma_discriminador.nomeDiscriminador;
                atendimento.fluxograma = fluxograma_discriminador.nomeFluxograma;
                atendimento.paciente = this.state.paciente.id;
                this.setState({atendimento: atendimento});
                $("#fluxograma").val(fluxograma_discriminador.nomeFluxograma);
                

                if(fluxograma_discriminador.cor == "VERMELHO"){
                    this.setState({cor: '#ff0000'})
                }
                else if(fluxograma_discriminador.cor == "LARANJA"){
                    this.setState({cor: '#ff8c00'})
                }
                else if(fluxograma_discriminador.cor == "AMARELO"){
                    this.setState({cor: '#ffff00'})
                }
                else if(fluxograma_discriminador.cor == "VERDE"){
                    this.setState({cor: '#008000'})
                }
                else if(fluxograma_discriminador.cor == "AZUL"){
                    this.setState({cor: '#0000ff'})
                }
            });
        }
    }

    handleChange(e){
        var atendimento = this.state.atendimento;
        var newValue = e.target.value;
        var campo = e.target.id;
        
        newValue = newValue.toUpperCase();
        var tipo;
        if(campo == "registro" || campo == 'numero'){
            tipo = 'int';
        }
        else if(campo == 'saturacao' || campo == 'glasgow' || campo == 'tax' || campo == 'hgt' || campo == 'fc' || campo == 'peso' || campo == 'temperatura'){
            tipo = 'float';
        }
        else if(campo == 'nascimento'){
            tipo = 'date';
        }
        else if(campo == "descricao"){
            tipo = 'livre';
        }
        else if(campo == 'pa'){
            tipo = "pa";
        }
        else{
            tipo = 'text';
        }

        if(campo == 'nome' || campo == 'nascimento' || campo == 'mae' || campo == 'numero' || campo == 'profissao' || campo == 'complemento' || campo == 'logradouro'){
            var paciente = this.state.paciente;
            var oldValue = paciente[campo];
            paciente[campo] = validar(tipo, newValue, oldValue);
            this.setState({
                paciente: paciente
            });
        }
        else{
            var oldValue = atendimento[campo];
            atendimento[campo] = validar(tipo, newValue, oldValue);
            this.setState({
                atendimento: atendimento
            });
        }
    }

    handleSelect(e){
        var paciente = this.state.paciente;
        paciente[e.target.id] = e.target.value;
        this.setState({paciente: paciente});
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
            nome: this.state.paciente.nome,
            mae: this.state.paciente.mae,
            nascimento: this.state.paciente.nascimento
        }

        $("#tabela").addClass("d-none");
        $("#spinner").removeClass("d-none");

        axios.post("http://systh/api/paciente?page="+pageNumber,pacientes)
        .then(response => this.closeLoading(response))
    }

    preencherFluxograma(){ // Busca no Banco os dados para preenchimento do ComboBox Fluxograma;
        axios.get("http://systh/api/fluxograma")
        .then(response => {this.setState({fluxograma: response.data})});
    }

    //obtem o código do fluxograma e preenche o combobox do discriminador
    fluxograma(e){
        $('#discriminador').prop('disabled',true);
        $('#discriminador').val('');
        this.setState({classificacao: 'Cor', cor: '#ffffff'});
        var fluxograma = e.target.value;
        var atendimento = this.state.atendimento;
        atendimento.fluxograma = fluxograma;
        this.setState({atendimento: atendimento});

        for(var i = 0; i < this.state.fluxograma.length; i++){
            if(fluxograma == this.state.fluxograma[i].nome){
                fluxograma = this.state.fluxograma[i].id;
                break;
            }
        }
        if(typeof fluxograma === "number"){
            var atendimento = this.state.atendimento;
            atendimento.numeroFluxograma = fluxograma;
            this.setState({atendimento: atendimento});
            axios.get("api/discriminador/"+fluxograma)
            .then((response) => {
                this.setState({discriminador: response.data});
                $('#discriminador').prop('disabled',false);
            });
        } 
    }

    //obtem o código da classificação
    discriminador(e){
        for(var i = 0; i < this.state.discriminador.length; i++){
            var atendimento = this.state.atendimento;
            if(e.target.value == this.state.discriminador[i].nome){
                atendimento.fluxograma_discriminador = this.state.discriminador[i].id;
                atendimento.discriminador = e.target.value;
                this.setState({atendimento: atendimento});
                this.setState({classificacao: this.state.discriminador[i].cor});
                if(this.state.discriminador[i].cor == "VERMELHO"){
                    this.setState({cor: '#ff0000'})
                }
                else if(this.state.discriminador[i].cor == "LARANJA"){
                    this.setState({cor: '#ff8c00'})
                }
                else if(this.state.discriminador[i].cor == "AMARELO"){
                    this.setState({cor: '#ffff00'})
                }
                else if(this.state.discriminador[i].cor == "VERDE"){
                    this.setState({cor: '#008000'})
                }
                else if(this.state.discriminador[i].cor == "AZUL"){
                    this.setState({cor: '#0000ff'})
                }
                break;
            }
            else{
                atendimento.fluxograma_discriminador = "";
                this.setState({atendimento: atendimento});
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
            $("#tabela").addClass("d-none");
            $("#spinner").removeClass("d-none");
            
            axios.post('http://systh/api/paciente',pacientes)
            .then(response => this.closeLoading(response))
            .catch(e => this.redirectToHome(e));
        }
    }

    closeLoading(response){
        this.setState({
                pacientes: response.data.data,
                activePage: response.data.current_page,
                itemsCountPerPage: response.data.per_page,
                totalItemsCount: response.data.total
        });
        $("#tabela").removeClass("d-none");
        $("#spinner").addClass('d-none');
    }

    selecionar(e, row){
        e.preventDefault()
        var atendimento = this.state.atendimento;
        var paciente = this.state.paciente;
        atendimento.paciente = row.id;
        paciente.nome = row.nome;
        paciente.mae = row.mae;
        paciente.nascimento = row.nascimento;
        paciente.profissao = row.profissao;
        paciente.logradouro = row.logradouro;
        paciente.complemento = row.complemento;
        paciente.numero = row.numero;
        paciente.etnia = row.etnia;
        paciente.naturalidade = row.naturalidade;
        paciente.tipoLogradouro = row.tipoLogradouro;
        paciente.bairro = row.bairro;
        paciente.municipio = row.municipio;
        this.setState({paciente: paciente, atendimento: atendimento});
        this.fecharModal(e);
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
            descricao: this.state.atendimento.descricao,
            fluxograma_discriminador: this.state.atendimento.fluxograma_discriminador
        }
        if(!atendimento.paciente){
            alert("Selecione um Paciente.");
        }
        else if(!atendimento.registro){
            alert("Informe o número de Registro do sistema Sonner.");
        }
        else if(!atendimento.fluxograma_discriminador){
            alert("Selecione um Fluxograma e um Discriminador")
        }
        else{
            if(!this.state.atendimento.id){
                axios.post('/api/atendimento/store',atendimento)
                .then(e => (this.imprimir()))
                //.catch((e) => this.redirectToHome(e));
            }
            else{
                axios.put('/api/atendimento/update/'+this.state.atendimento.id,atendimento)
                .then(e => this.imprimir())
                .catch(e => (this.redirectToHome(e)));
            }
        }
    }

    redirectToHome(e){
        if (e.response || e.request) {
            alert("OCORREU UM ERRO DE CONEXÃO \n Você será redirecionado à página HOME!\nStatus do Erro" + e.response.status );
            window.location.replace("/home");
        } 
    }

    imprimir(){
        
        var paciente = this.state.paciente;
        var atendimento = this.state.atendimento;
        atendimento.saturacao = atendimento.saturacao?atendimento.saturacao+" %":"";
        atendimento.fc = atendimento.fc?atendimento.fc+" bpm":"";
        atendimento.hgt = atendimento.hgt?atendimento.hgt+" mg/dL":"";
        atendimento.pa = atendimento.pa?atendimento.pa+" mmHg":"";
        atendimento.tax = atendimento.tax?atendimento.tax+" <sob>o</sob>C":"";
        atendimento.peso = atendimento.peso?atendimento.peso+" kg":"";

        var table = "<table><tr class='center'><td><img src='http://systh/images/brasao.png'></td><td colspan='3'><b>PREFEITURA MUNICIPAL DE TEÓFILO OTONI <br> SECRETARIA MUNICIPAL DE SAÚDE <br> Unidade de Pronto Atendimento</b></td><td><img src='images/upa.png'></td></tr>";
        table = table + "<tr class='center'><td colspan='5'><b>SECRETARIA DE ESTADO DE SAÚDE DE MINAS GERAIS</b></td></tr>";
        table = table + "<tr class='center'><td colspan='5'><b>ACOLHIMENTO COM CLASSIFICAÇÃO DE RISCO - SISTEMA DE MANCHESTER</b></td></tr>";
        table = table + "<tr><td colspan='5' bgcolor='C0C0C0'>&nbsp;</td></tr>";
        table = table + "<tr class='center'><td colspan='5' >IDENTIFICAÇÃO DO PACIENTE</td></tr>";
        table = table + "<tr><td colspan='5'><b>Nome: </b>" +  paciente.nome +" </td></tr>";
        table = table + "<tr><td colspan='2'><b>Idade: </b>" +  paciente.nascimento +"</td><td colspan='3'><b>Registro: </b>" +  atendimento.registro + "</td></tr>";
        table = table + "<tr><td colspan='5'><b>Mãe: </b>" +  paciente.mae + " </td></tr>";
        table = table + "<tr><td colspan='2'><b>Etnia: </b>" +  paciente.etnia +"</td><td colspan='3'><b>Naturalidade: </b>" + paciente.naturalidade+ " </td></tr>";
        table = table + "<tr><td colspan='5'><b>Profissão: </b>" + paciente.profissao +" </td></tr>";
        table = table + "<tr><td colspan='5'><b>Endereço: </b>" + paciente.tipoLogradouro + " " +paciente.logradouro + ", nº "+ paciente.numero +", "+ paciente.complemento+"</td></tr>";
        table = table + "<tr><td colspan='2'><b>Bairro: </b>" + paciente.bairro + "</td><td colspan='3'><b>Cidade: </b>" + paciente.municipio + " </td></tr>";
        table = table + "<tr><td colspan='5' bgcolor='C0C0C0'>&nbsp;</td></tr>";
        table = table + "<tr class='center'><td colspan='5' >CLASSIFICAÇÃO DE RISCO</td></tr>";
        table = table + "<tr><td colspan='5'><b>Descrição: </b>" + atendimento.descricao+ "" + " </td></tr>";
        table = table + "<tr><td colspan='4'><b>Fluxograma: </b>" + atendimento.fluxograma +"</td><td colspan='2'><b>Número: </b>" + atendimento.numeroFluxograma +" </td></tr>";
        table = table + "<tr><td colspan='5'><b>Discriminador: </b>" + atendimento.discriminador + " </td></tr>";
        table = table + "<tr><td colspan='5' bgcolor='C0C0C0'>&nbsp;</td></tr>";
        table = table + "<tr class='center'><td colspan='5' > SINAIS VITAIS </td></tr>";
        table = table + "<tr><td colspan='2'><b>Saturação: </b>" + atendimento.saturacao +"</td><td colspan='3'><b>Glasgow: </b>" + atendimento.glasgow + " </td></tr>";
        table = table + "<tr><td colspan='2'><b>TAX: </b>" + atendimento.tax + "</td><td colspan='3'><b>HGT: </b>" + atendimento.hgt +" </td></tr>";
        table = table + "<tr><td colspan='2'><b>PA: </b>" + atendimento.pa +"</td><td colspan='3'><b>FC: </b>" + atendimento.fc + " </td></tr>";
        table = table + "<tr><td colspan='5'><b>Peso: </b>" + atendimento.peso +"</td></tr>";
        table = table + "<tr><td colspan='5' bgcolor='C0C0C0'>&nbsp;</td></tr>";
        table = table + "<tr class='center'><td colspan='5' > ENFERMEIRO RESPONSÁVEL </td></tr>";
        table = table + "<tr><td colspan='4'><b>Enfermeiro: </b>" + this.state.user.name +"</td><td colspan='2'><b>Coren: </b>" + this.state.user.coren +" </td></tr>";
        table = table + "<tr><td colspan='5'><b>Coordenador: </b>" + "Edson Mauriz" + " </td></tr>";
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
        this.cancelar();
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
        $('#headerModal').text('Cadastro de Paciente');
        $('#bodyBuscar').addClass('d-none');
        $('#bodyCadastrar').removeClass('d-none');
        $('#btnCadastrar').addClass('d-none');
        $('#btnSalvar').removeClass('d-none');
        this.listar();
    }

    fecharModal(e){
        e.preventDefault();

        this.setState({pacientes: []});
        $('#bodyCadastrar').addClass('d-none');
        $('#bodyBuscar').removeClass('d-none');
        $('#btnCadastrar').removeClass('d-none');
        $('#btnSalvar').addClass('d-none');
        $('#headerModal').text('Selecionar Paciente');

        if(e.target.id == "cancelar"){
            var atendimento = this.state.atendimento;
            atendimento.paciente = "";
            this.setState({atendimento: atendimento});
            this.setState({paciente:{nome: "", mae: "", nascimento: "", municipio: "",bairro: "",naturalidade: "",etnia: "",tipoLogradouro: "", profissao: "", numero: "", logradouro: "", complemento: ""}});
        }

    }

    //////// ====== MÉTODOS UTILIZADOS PARA CADASTRO DE PACIENTE ==========////////

    listar(){ // Busca no Banco de dados os dados para ComboBox
        axios.get("http://systh/api/municipio")
        .then((response)=> {this.setState({municipios: response.data})});

        axios.get('http://systh/api/etnia')
        .then((response) => {this.setState({etnias: response.data})});

        axios.get('http://systh/api/tipologradouro')
        .then((response) => {this.setState({tiposlogradouro: response.data})});
    }

    salvar(e){
        e.preventDefault();

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


        //Para tranformar o nome em id para salvar no banco
        for(var i = 0; i < this.state.municipios.length; i++){
            if(this.state.paciente.municipio == (this.state.municipios[i].nome + '-' + this.state.municipios[i].uf)){
                paciente.municipio = this.state.municipios[i].id;
            }
            if(this.state.paciente.naturalidade == this.state.municipios[i].nome + '-' + this.state.municipios[i].uf){
                paciente.naturalidade = this.state.municipios[i].id;
            }
        }

        //Para tranformar o nome em id para salvar no banco
        for(var i = 0; i < this.state.tiposlogradouro.length; i++){
            if(this.state.paciente.tipoLogradouro == this.state.tiposlogradouro[i].nome){
                paciente.tipoLogradouro = this.state.tiposlogradouro[i].id;
                break;
            }
        }

        //Para tranformar o nome em id para salvar no banco
        for(var i = 0; i < this.state.etnias.length; i++){
            if(this.state.paciente.etnia == this.state.etnias[i].nome){
                paciente.etnia = this.state.etnias[i].id;
                break;
            }
        }
        
        if(!this.state.paciente.id){
            var atendimento = this.state.atendimento;
            axios.post('/api/paciente/store',paciente)
            .then(response => atendimento.paciente = response.data);
            this.setState({atendimento: atendimento});
        }
        else{
            axios.put('/api/paciente/update/'+this.state.paciente.id,paciente);
        }
        this.fecharModal(e);
    }

    cancelar(){
        this.setState({classificacao: 'Cor', cor: '#ffffff'});
        this.setState({atendimento: {paciente: "",registro: "", saturacao: "",glasgow: "", tax: "", fc: "", pa: "", hgt: "", peso: "", fluxograma: "", discriminador: "", descricao:""}});
        this.setState({paciente:{nome: "", mae: "", nascimento: "", municipio: "",bairro: "",naturalidade: "",etnia: "",tipoLogradouro: "", profissao: "", numero: "", logradouro: "", complemento: ""}});
    }

    //////// ====== ==== ==== ==== ==== ==== ==== ==== ==== ==== ==========////////
    //////// ========== MÉTODOS USADOS PARA EDITAR UM PACIENTE  ===========////////
    editarPaciente(row){

        var paciente = this.state.paciente;
        paciente.id = row.id;
        paciente.nome = row.nome;
        paciente.mae = row.mae;
        paciente.nascimento = row.nascimento;
        paciente.profissao = row.profissao;
        paciente.logradouro = row.logradouro;
        paciente.complemento = row.complemento;
        paciente.numero = row.numero;
        paciente.etnia = row.etnia;
        paciente.naturalidade = row.naturalidade;
        paciente.tipoLogradouro = row.tipoLogradouro;
        paciente.bairro = row.bairro;
        paciente.municipio = row.municipio;
        var atendimento = this.state.atendimento;
        atendimento.paciente = paciente.id;
        this.setState({atendimento: atendimento});

        this.setState({paciente: paciente});
        this.listar();
        $('#headerModal').text('Cadastro de Paciente');
        $('#bodyBuscar').addClass('d-none');
        $('#bodyCadastrar').removeClass('d-none');
        $('#btnCadastrar').addClass('d-none');
        $('#btnSalvar').removeClass('d-none');
    }
    //////// ========== ======= ============ ======== ========  ===========////////
    render(){
        return(
            <div className="container-fluid">
                <div className="formulario" > 
                    <div className="form-group row">
                        <div className="col-md-6 border border-dark">
                            <form id="identificacao">
                                <center><h5>Identificação do Paciente</h5></center>
                                <div className="form-group row">
                                    <label htmlFor="registro" className="col-sm-2 col-form-label"> Registro: </label>
                                    <div className="col-sm-4">
                                        <input onChange={this.handleChange} value={this.state.atendimento.registro} type="text" className="form-control text-uppercase" id="registro" placeholder="Registro Sonner"/>
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
                                        <input onChange={this.handleChange} value={this.state.paciente.nascimento} type="date" className="form-control text-uppercase" id="nascimento" placeholder="Nascimento"/>
                                    </div>
                                    <div className="col-sm-5 text-center mt-sm-0 mt-1">
                                        <button onClick={(e) => this.buscar(e)} data-toggle="modal" data-target="#paciente" className="btn btn-primary col-12"> BUSCAR </button>
                                    </div>
                                </div>
                                <center><h5>Descrição</h5></center>
                                <div className="form-group row">
                                    <label htmlFor="descricao" className="col-sm-2 col-form-label"> Descrição: </label>
                                    <div className="col-sm-10">
                                        <textarea onChange={this.handleChange}  value={this.state.atendimento.descricao} className="form-control text-uppercase" id="descricao" placeholder="Queixa/Situação"/>
                                    </div>
                                </div>
                            </form> 
                        </div>
                        <div className="col-md-6 border border-dark">
                            <form>
                                <center><h5>Sinais Vitais</h5></center>
                                <div className="form-group row">
                                    <label htmlFor="saturacao" className="col-sm-2 col-form-label"> Saturação: </label>
                                    <div className="col-sm-4">
                                        <input onChange={this.handleChange} value={this.state.atendimento.saturacao} type="text" className="form-control text-uppercase" id="saturacao" placeholder="Oxigênio"/>
                                    </div>
                                    <label htmlFor="glasgow" className="col-sm-2 col-form-label"> Glasgow: </label>
                                    <div className="col-sm-4">
                                        <input onChange={this.handleChange} value={this.state.atendimento.glasgow} type="text" className="form-control text-uppercase" id="glasgow" placeholder="Glasgow"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="tax" className="col-sm-2 col-form-label"> Tax: </label>
                                    <div className="col-sm-4">
                                        <input onChange={this.handleChange} value={this.state.atendimento.tax} type="text" className="form-control text-uppercase" id="tax" placeholder="Tax"/>
                                    </div>
                                    <label htmlFor="hgt" className="col-sm-2 col-form-label"> HGT: </label>
                                    <div className="col-sm-4">
                                        <input onChange={this.handleChange} value={this.state.atendimento.hgt} type="text" className="form-control text-uppercase" id="hgt" placeholder="HGT"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="pa" className="col-sm-2 col-form-label"> PA: </label>
                                    <div className="col-sm-4">
                                        <input onChange={this.handleChange} value={this.state.atendimento.pa} type="text" className="form-control text-uppercase" id="pa" placeholder="Pressão Arterial"/>
                                    </div>
                                    <label htmlFor="fc" className="col-sm-2 col-form-label"> FC: </label>
                                    <div className="col-sm-4">
                                        <input onChange={this.handleChange} value={this.state.atendimento.fc} type="text" className="form-control text-uppercase" id="fc" placeholder="FC"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="peso" className="col-sm-2 col-form-label"> Peso: </label>
                                    <div className="col-sm-4">
                                        <input onChange={this.handleChange} value={this.state.atendimento.peso} type="text" className="form-control text-uppercase" id="peso" placeholder="Peso"/>
                                    </div>
                                </div>
                                <center><h5>Classificação de Risco</h5></center>
                                <div className="form-group row">
                                    <label htmlFor="fluxograma" className="col-sm-2 col-form-label"> Fluxograma: </label>
                                    <div className="col-sm-10">
                                        <input className="form-control text-uppercase" type="text" id="fluxograma" list="cbFluxograma" onChange={e => this.fluxograma(e)} value={this.state.atendimento.fluxograma} placeholder="Fluxograma"/>
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
                                        <input className="form-control text-uppercase" disabled type="text" id="discriminador" list="cbDiscriminador" onChange={e => this.discriminador(e)} value={this.state.atendimento.discriminador} placeholder="Discriminador"/>
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
                    <div className="modal fade" id="paciente" tabIndex="-1" data-backdrop="static" role="dialog" aria-labelledby="headerModal" aria-hidden="true">
                        <div className="modal-dialog modal-xl"  role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="headerModal">Selecionar Paciente</h5>
                                    <button type="button" className="close" onClick={e => this.fecharModal(e)} data-dismiss="modal" aria-label="Fechar">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            <div className="modal-body">
                                <div id="bodyBuscar">
                                    <div> 
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
                                                    <button onClick={(e) => this.buscar(e)} className="btn btn-primary col-sm-12 mt-1 m-md-0" > Buscar </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <center>
                                        <div className="spinner-border d-none" id="spinner" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </center>
                                    <div className="table-responsive" id="tabela">
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
                                                        <td><button className="btn btn-warning" onClick={e => this.editarPaciente(row)}><img src={Edit}/></button><button className="btn btn-primary" data-dismiss="modal"  onClick = {e => this.selecionar(e, row)}><img src={Selecionar}/></button></td>       
                                                    </tr>
                                                    )}
                                            </tbody>
                                        </table>
                                        <div>
                                            <center>
                                                <div className="col-md-3">
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
                                            </center>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-none" id="bodyCadastrar">
                                    <form id="formPaciente" className="row">
                                        <div className="col-md-6 border border-dark">
                                            <center><h5>Dados Pessoais</h5></center>
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
                                                    <input onChange={this.handleChange} value={this.state.paciente.nascimento} type="date" className="form-control text-uppercase" id="nascimento" placeholder="Nascimento"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="etnia" className="col-sm-2 col-form-label"> Etnia: </label>
                                                <div className="col-sm-10">
                                                <input className="form-control text-uppercase" type="text" id="etnia" list="cbEtnia" onChange={this.handleSelect} value={this.state.paciente.etnia} placeholder="Etnia"/>
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
                                                    <input className="form-control text-uppercase" type="text" id="naturalidade"  list="cbNaturalidade" onChange={this.handleSelect} value={this.state.paciente.naturalidade} placeholder="Naturalidade"/>
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
                                        <div className="col-md-6 border border-dark">
                                            <center><h5>Endereço</h5></center>
                                            <div className="form-group row">
                                                <label htmlFor="tipologradouro" className="col-sm-3 col-form-label"> Tipo Logradouro: </label>
                                                <div className="col-sm-9">
                                                    <input className="form-control text-uppercase" type="text" id="tipoLogradouro" list="cbTipoLogradouro" onChange={this.handleSelect} value={this.state.paciente.tipoLogradouro} placeholder="Ex: Rua, Avenida"/>
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
                                                    <input onChange={this.handleChange} value={this.state.paciente.logradouro} type="text" className="form-control text-uppercase" id="logradouro" placeholder="Logradouro"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="numero" className="col-sm-3 col-form-label"> Número: </label>
                                                <div className="col-sm-5">
                                                    <input onChange={this.handleChange} value={this.state.paciente.numero} type="text" className="form-control text-uppercase" id="numero" placeholder="Número da Residência"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="complemento" className="col-sm-3 col-form-label"> Complemento: </label>
                                                <div className="col-sm-9">
                                                    <input onChange={this.handleChange} value={this.state.paciente.complemento} type="text" className="form-control text-uppercase" id="complemento" placeholder="Complemento"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="municipio"  className="col-sm-3 col-form-label"> Município: </label>
                                                <div className="col-sm-9">
                                                    <input className="form-control text-uppercase" type="text" id="municipio" list="cbMunicipio" onChange={this.handleSelect} value={this.state.paciente.municipio} placeholder="Município"/>
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
                                                    <input className="form-control text-uppercase" type="text" id="bairro" list="cbBairro" onChange={this.handleSelect} value={this.state.paciente.bairro} placeholder="Bairro"/>
                                                    <datalist id="cbBairro">
                                                        <option value="BELA VISTA" />
                                                        <option value="CENTRO" />
                                                        <option value="SAO CRISTOVAO" />
                                                        <option value="SAO JACINTO" />
                                                        <option value="VIRIATO" />
                                                    </datalist>   
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" id="cancelar" onClick={e => this.fecharModal(e)} data-dismiss="modal">Cancelar</button>
                                    <button id="btnCadastrar" type="button" className="btn btn-primary" onClick={e => this.cadastrar(e)}>Cadastrar</button>
                                    <button id="btnSalvar" type="button" className="btn btn-primary d-none" onClick={e => this.salvar(e)} data-dismiss="modal">Salvar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row text-right">
                    <div  className="col-md-3">&nbsp;</div>
                    <div  className="col-md-6"  ><center><div align="right" className="col-md-8 border border-dark rounded p-2 text-center m-0 h5 text-uppercase" style={{background: this.state.cor}}>&nbsp;{this.state.classificacao}</div></center></div>
                    <div  className="col-md-3 text-md-right text-center mt-1">
                        <button className="btn btn-primary" onClick={e => this.incluir(e)} > Salvar </button>&nbsp;
                        <button className="btn btn-warning">Cancelar</button>&nbsp;
                    </div>
                </div>
                <br/>
            </div>
        );
    }
}