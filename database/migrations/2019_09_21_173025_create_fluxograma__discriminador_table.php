<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFluxogramaDiscriminadorTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('Fluxograma_Discriminador', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('cor',20);

            $table->unsignedBigInteger('fluxograma');
            $table->unsignedBigInteger('discriminador');

            $table->foreign('fluxograma')->references('id')->on('Fluxograma');
            $table->foreign('discriminador')->references('id')->on('Discriminador');
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
        Schema::dropIfExists('Fluxograma_Discriminador');
    }
}
