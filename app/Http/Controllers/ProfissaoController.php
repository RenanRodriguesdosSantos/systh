<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Profissao;

class ProfissaoController extends Controller
{
    public function index(){
        return Profissao::all();
    }
}
