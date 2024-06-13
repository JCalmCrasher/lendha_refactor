<?php

namespace App\Console\Commands;

use App\Services\AirtableCustomerMigrationService;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class AirtableCustomerMigration extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'airtable:migrate-customers';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate customers from Airtable to Lendha';

    /**
     * Execute the console command.
     */
    public function handle(AirtableCustomerMigrationService $airtableMigrationService): void
    {
        try {
            $this->info('Customer migration starting...');

            $airtableMigrationService->fetchUserRecords();

            $this->info('Customer migration completed successfully.');
        } catch (Exception $e) {
            Log::error($e);
            $this->error('Error during customer migration: ' . $e->getMessage());
        }
    }
}
