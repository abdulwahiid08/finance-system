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
        Schema::create('transaction_details', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('transaction_id');
            $table->foreign('transaction_id')->references('id')->on('transactions')->onDelete('cascade');
            $table->uuid('account_id');
            $table->foreign('account_id')->references('id')->on('accounts')->onDelete('restrict');
            $table->enum('type', ['debit', 'credit']);
            $table->decimal('amount', 20, 2);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['transaction_id', 'account_id']);
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_details');
    }
};
