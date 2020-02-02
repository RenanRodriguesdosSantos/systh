<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Paciente;
use Illuminate\Support\Facades\DB;

class PacienteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Paciente::all();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $paciente = new Paciente();
        $paciente->nome = $request->nome;
        $paciente->mae = $request->mae;
        $paciente->nascimento = $request->nascimento;
        $paciente->logradouro = $request->logradouro;
        $paciente->numero = $request->numero;
        $paciente->complemento = $request->complemento;
        $paciente->profissao = $request->profissao;

        $paciente->bairro = $request->bairro;
        $paciente->municipio = $request->municipio;
        $paciente->naturalidade = $request->naturalidade;
        $paciente->tipoLogradouro = $request->tipoLogradouro;
        $paciente->etnia = $request->etnia;

        $paciente->save();

        return Paciente::first()->orderBy("id","desc")->value("id");
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function show(Request $request)
    {
        return Paciente::join("Etnia","Paciente.etnia","=","Etnia.id")
                        ->join("Municipio as N","Paciente.naturalidade", "=", "N.id")
                        ->join("Municipio","Paciente.municipio", "=", "Municipio.id")
                        ->join("TipoLogradouro","Paciente.tipoLogradouro", "=", "TipoLogradouro.id")
                        ->select("Paciente.*","Etnia.nome as etnia",DB::raw("concat(N.nome,'-',N.uf) as naturalidade"),"TipoLogradouro.nome as tipoLogradouro",DB::raw("concat(Municipio.nome, '-', Municipio.uf) as municipio"))
                        ->where("Paciente.nome","LIKE",$request->nome."%")
                        ->where("Paciente.mae","LIKE",$request->mae."%")
                        ->where(function ($query) use ($request){
                                if(isset($request->nascimento)){
                                    $query->whereDate("Paciente.nascimento",$request->nascimento);
                                }
                        })
                        ->paginate(4);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        return Paciente::join("Etnia","Paciente.etnia","=","Etnia.id")
                        ->join("Municipio as N","Paciente.naturalidade", "=", "N.id")
                        ->join("Municipio","Paciente.municipio", "=", "Municipio.id")
                        ->join("TipoLogradouro","Paciente.tipoLogradouro", "=", "TipoLogradouro.id")
                        ->select("Paciente.*","Etnia.nome as etnia",DB::raw("concat(N.nome,'-',N.uf) as naturalidade"),"TipoLogradouro.nome as tipoLogradouro",DB::raw("concat(Municipio.nome, '-', Municipio.uf) as municipio"))
                        ->where("Paciente.id","=",$id)
                        ->get();
    }
    // retorna o id do utimo paciente cadastrado;
    public function ultimo(){
        return Paciente::first()->order("desc")->value("id");
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $paciente = Paciente::find($id);
        $paciente->nome = $request->nome;
        $paciente->mae = $request->mae;
        $paciente->nascimento = $request->nascimento;
        $paciente->logradouro = $request->logradouro;
        $paciente->numero = $request->numero;
        $paciente->complemento = $request->complemento;
        $paciente->profissao = $request->profissao;
        $paciente->bairro = $request->bairro;

        $paciente->municipio = $request->municipio;
        $paciente->naturalidade = $request->naturalidade;
        $paciente->tipoLogradouro = $request->tipoLogradouro;
        $paciente->etnia = $request->etnia;
        $paciente->save();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
