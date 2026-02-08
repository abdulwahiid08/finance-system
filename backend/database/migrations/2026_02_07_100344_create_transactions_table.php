<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('transaction_number', 50)->unique();
            $table->date('transaction_date');
            $table->text('description');
            $table->decimal('total_amount', 20, 2);
            $table->uuid('created_by');
            $table->foreign('created_by')->references('id')->on('users');
            $table->timestamps();
            $table->softDeletes();

            $table->index('transaction_date');
            $table->index('transaction_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
