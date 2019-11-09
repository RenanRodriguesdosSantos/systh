<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Paciente;

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
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function show(Request $request)
    {
        return Paciente::where('nome','LIKE',$request->nome.'%')
                       ->where('mae','LIKE',$request->mae.'%')
                       ->where(function ($query) use ($request){
                            if(isset($request->nascimento)){
                                $query->whereDate('nascimento',$request->nascimento);
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
        //
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
        //
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
