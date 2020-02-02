<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Fluxograma_Discriminador;

class Fluxograma_DiscriminadorController extends Controller
{
    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id){
        return Fluxograma_Discriminador::join('Discriminador','Fluxograma_Discriminador.discriminador','=','Discriminador.id')->where('Fluxograma_Discriminador.fluxograma','=',$id)->select("Fluxograma_Discriminador.*","Discriminador.nome")->get();
    }

    public function store(Request $request){
        $fluxograma_discriminador = new Fluxograma_Discriminador();
        $fluxograma_discriminador->fluxograma = $request->fluxograma;
        $fluxograma_discriminador->discriminador = $request->discriminador;
        $fluxograma_discriminador->cor = $request->cor;
        $fluxograma_discriminador->save();

    }

    public function edit($id){
        return Fluxograma_Discriminador::join('Discriminador','Fluxograma_Discriminador.discriminador','=','Discriminador.id')->join('Fluxograma','Fluxograma_Discriminador.fluxograma','=','Fluxograma.id')->where('Fluxograma_Discriminador.id','=',$id)->select("Fluxograma_Discriminador.*","Discriminador.nome as nomeDiscriminador","Fluxograma.nome as nomeFluxograma")->get();
    }
}
