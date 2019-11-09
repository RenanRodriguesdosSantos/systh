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

   
    public function show(Request $request)
    {
        return Atendimento::join("Paciente","Atendimento.paciente","=","Paciente.id")
                        ->join("users","Atendimento.enfermeiro","=","users.id")
                        ->join("Fluxograma_Discriminador","Atendimento.fluxograma_discriminador","=","Fluxograma_Discriminador.id")
                        ->join("Fluxograma","Fluxograma_Discriminador.fluxograma","=","Fluxograma.id")
                        ->join("Discriminador","Fluxograma_Discriminador.discriminador","=","Discriminador.id")
                        ->select("Atendimento.*","users.name as enfermeiro","Paciente.nome as paciente","Paciente.mae","Paciente.nascimento","Fluxograma_Discriminador.cor")
                        ->orderBy("created_at","desc")
                        ->where("users.name","LIKE",$request->enfermeiro.'%')
                        ->where('Paciente.nome','LIKE',$request->nome.'%')
                        ->where('Paciente.mae','LIKE',$request->mae.'%')
                        ->where(function ($query) use ($request){
                            if(isset($request->nascimento)){
                                $query->whereDate('Paciente.nascimento',$request->nascimento);
                            }
                            if(isset($request->datainicial)){
                                if(isset($request->datafinal)){
                                    $query->whereBetween("Atendimento.created_at",[$request->datainicial,$request->datafinal]);
                                }else{
                                    $query->whereDate('Atendimento.created_at',$request->datainicial);
                                }
                            }
                            else{
                                $query->whereDate('Atendimento.created_at',date("y/m/d"));
                            }
                        })
                        ->paginate(20);
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
