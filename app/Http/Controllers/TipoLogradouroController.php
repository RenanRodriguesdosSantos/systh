<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TipoLogradouro;

class TipoLogradouroController extends Controller
{
    public function index(){
        return TipoLogradouro::all();
    }
}
