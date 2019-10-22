<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Etnia;

class EtniaController extends Controller
{
    public function index(){
        return Etnia::all();
    }
}
