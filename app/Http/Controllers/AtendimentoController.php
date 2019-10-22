<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Atendimento;

class AtendimentoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Atendimento::paginate(10);
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
        $atendimento = new Atendimento();
        $atendimento->paciente = $request->paciente;
        $atendimento->enfermeiro = $request->enfermeiro;
        $atendimento->fluxograma_discriminador = $request->fluxograma_discriminador;
        $atendimento->registro = $request->registro;
        $atendimento->saturacao = $request->saturacao;
        $atendimento->glasgow = $request->glasgow;
        $atendimento->tax = $request->tax;
        $atendimento->hgt = $request->hgt;
        $atendimento->pa = $request->pa;
        $atendimento->fc = $request->fc;
        $atendimento->temperatura = $request->temperatura;
        $atendimento->peso = $request->peso;
        $atendimento->descricao = $request->descricao;
        $atendimento->save();
    }

   
    public function show()
    {
        return Atendimento::join("Paciente","Atendimento.paciente","=","Paciente.id")
                          ->join("users","Atendimento.enfermeiro","=","users.id")
                          ->join("Fluxograma_Discriminador","Atendimento.fluxograma_discriminador","=","Fluxograma_Discriminador.id")
                          ->join("Fluxograma","Fluxograma_Discriminador.fluxograma","=","Fluxograma.id")
                          ->join("Discriminador","Fluxograma_Discriminador.discriminador","=","Discriminador.id")
                          ->select("Atendimento.*","users.name as enfermeiro","Paciente.nome as paciente","Paciente.mae","Paciente.nascimento","Fluxograma_Discriminador.cor")
                          ->paginate(10);
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
