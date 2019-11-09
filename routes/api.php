<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('bairro','BairroController@index');
Route::get('fluxograma','FluxogramaController@index');
Route::get('discriminador','DiscriminadorController@index');
Route::get('municipio','MunicipioController@index');
Route::get('tipologradouro','TipoLogradouroController@index');
Route::get('etnia','EtniaController@index');
Route::get('profissao','ProfissaoController@index');
Route::post('paciente/store','PacienteController@store');
Route::post('paciente','PacienteController@show');
Route::get('discriminador/{id}','Fluxograma_DiscriminadorController@show'); // Deve ser enviado o id do fluxograma
Route::post('fluxograma/store','FluxogramaController@store');
Route::post('discriminador/store','DiscriminadorController@store');
Route::post('fluxograma/discriminador/store','Fluxograma_DiscriminadorController@store');
Route::post('atendimentos','AtendimentoController@show');
Route::post('atendimento/store','AtendimentoController@store');


