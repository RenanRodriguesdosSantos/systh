<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Auth::routes();
//Auth::routes(["register" => false]);

//Route::get('/{path}', 'HomeController@index')->name('home')->where('path','.*');
Route::get('/home','HomeController@index')->name('home');
Route::get('/atendimento','HomeController@index')->name('home');
Route::get('/atendimentos','HomeController@index')->name('home');
Route::get('/ajuda','HomeController@index')->name('home');
Route::get('/administrador','HomeController@index')->name('home');
Route::get('/sair',function(){
    Auth::logout();
    return redirect('/login');
});
Route::get("/administrador",function(){
    if(Auth::id() == 1){
        return view('home');
    }
    else{
        return abort(404);
    }
});
Route::get("/user",function(){   
    return Auth::user();
});
Route::redirect("/","/home");
