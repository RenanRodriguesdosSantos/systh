<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAtendimentoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('Atendimento', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->integer('registro');
            
            $table->float('saturacao',8,2)->nullable();
            $table->float('glasgow',8,2)->nullable();
            $table->float('tax',8,2)->nullable();
            $table->float('hgt',8,2)->nullable();
            $table->float('pa',8,2)->nullable();
            $table->float('fc',8,2)->nullable();
            $table->float('temperatura',8,2)->nullable();
            $table->float('peso',8,2)->nullable();

            $table->string('descricao')->nullable();

            $table->unsignedBigInteger('paciente');
            $table->unsignedBigInteger('enfermeiro');
            $table->unsignedBigInteger('fluxograma_discriminador');
            
            $table->foreign('paciente')->references('id')->on('Paciente');
            $table->foreign('enfermeiro')->references('id')->on('users');
            $table->foreign('fluxograma_discriminador')->references('id')->on('Fluxograma_Discriminador');

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
        Schema::dropIfExists('Atendimento');
    }
}
