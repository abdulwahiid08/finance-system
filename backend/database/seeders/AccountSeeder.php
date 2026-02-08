<?php

namespace Database\Seeders;

use App\Features\Account\Account;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ASSET (HARTA)
        $kas = Account::create([
            'code' => '10100',
            'name' => 'Kas',
            'type' => 'asset',
            'is_active' => true,
            'level' => 0,
        ]);

        Account::create([
            'code' => '1010001',
            'name' => 'Kas Kecil',
            'type' => 'asset',
            'parent_id' => $kas->id,
            'is_active' => true,
            'level' => 1,
        ]);

        Account::create([
            'code' => '1010002',
            'name' => 'Kas Bank',
            'type' => 'asset',
            'parent_id' => $kas->id,
            'is_active' => true,
            'level' => 1,
        ]);

        // LIABILITY (KEWAJIBAN)
        $utangUsaha = Account::create([
            'code' => '20100',
            'name' => 'Utang Usaha',
            'type' => 'liability',
            'is_active' => true,
            'level' => 0,
        ]);

        // EQUITY (MODAL)
        Account::create([
            'code' => '30100',
            'name' => 'Modal Pemilik',
            'type' => 'equity',
            'is_active' => true,
            'level' => 0,
        ]);

        // REVENUE (PENDAPATAN)
        $pendapatanUsaha = Account::create([
            'code' => '40100',
            'name' => 'Pendapatan Usaha',
            'type' => 'revenue',
            'is_active' => true,
            'level' => 0,
        ]);

        // EXPENSE (BEBAN)
        $bebanOperasional = Account::create([
            'code' => '50100',
            'name' => 'Beban Operasional',
            'type' => 'expense',
            'is_active' => true,
            'level' => 0,
        ]);

        Account::create([
            'code' => '5010001',
            'name' => 'Beban Alat Tulis Kantor',
            'type' => 'expense',
            'parent_id' => $bebanOperasional->id,
            'is_active' => true,
            'level' => 1,
        ]);
    }
}
