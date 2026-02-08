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
        Schema::create('accounts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code', 20)->unique()->comment('Auto-generated account code');
            $table->string('name');
            $table->enum('type', ['asset', 'liability', 'equity', 'revenue', 'expense']);
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->uuid('parent_id')->nullable();
            $table->foreign('parent_id')->references('id')->on('accounts')->onDelete('restrict');
            $table->decimal('balance', 20, 2)->default(0)->comment('Current balance');
            $table->integer('level')->default(0)->comment('Hierarchy level');
            $table->timestamps();
            $table->softDeletes();

            $table->index('type');
            $table->index('is_active');
            $table->index('parent_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
