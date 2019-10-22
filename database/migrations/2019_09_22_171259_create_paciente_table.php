<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePacienteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('Paciente', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('nome',45);
            $table->string('mae',45);
            $table->date('nascimento');
            $table->string('logradouro',50);
            $table->integer('numero');
            $table->string('complemento',50);
            $table->string('profissao',45);

            $table->unsignedBigInteger('bairro');
            $table->unsignedBigInteger('municipio');
            $table->unsignedBigInteger('tipoLogradouro');
            $table->unsignedBigInteger('naturalidade');
            $table->unsignedBigInteger('etnia');
            
            $table->foreign('bairro')->references('id')->on('Bairro');
            $table->foreign('municipio')->references('id')->on('Municipio');
            $table->foreign('tipoLogradouro')->references('id')->on('TipoLogradouro');
            $table->foreign('naturalidade')->references('id')->on('Municipio');
            $table->foreign('etnia')->references('id')->on('Etnia');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('Paciente');
    }
}
