<?php

namespace App\Jobs;

use App\Models\User;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Http\UploadedFile;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AirtableCustomerMigrationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public const FILE_NAME = 'airtable_lendha_migrations.csv';

    /**
     * Create a new job instance.
     */
    public function __construct(private readonly array $batchedUsers)
    {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        foreach ($this->batchedUsers as $batchedUser) {
            DB::transaction(function () use ($batchedUser) {
                try {

                    $airtableId = $batchedUser['airtable_id'];
                    $userData = $batchedUser['data'];

                    $user = User::create([
                        'name' => $userData['name'],
                        'email' => $userData['email'],
                        'bvn' => $userData['bvn'],
                        'phone_number' => $userData['name'],
                        'date_of_birth' => $userData['date_of_birth'],
                        'gender' => $userData['gender'],
                        'address' => $userData['address'],
                        'password' => Hash::make(Str::password(8)),
                    ]);

                    $userData = $this->handleFiles($userData, $user->id);

                    $business = $user->business()->create($userData['business']);
                    $business->business_registration()->create($userData['business_registration']);
                    $user->next_of_kin()->create($userData['next_of_kin']);
                    $user->guarantor()->create($userData['guarantor']);
                    $user->loans()->create($userData['loan']);
                    $user->account()->create($userData['account']);
                    $user->documents()->create($userData['document']);
                    $user->business_assessment()->create($userData['business_assessment']);

                    $this->writeUserToCsv($user, $airtableId);
                } catch (Exception $exception) {
                    Log::error($exception);

                    AirtableCustomerMigrationJob::dispatch([$batchedUser])->onQueue('failed_airtable_migrations');
                }
            });
        }
    }

    private function handleFiles(array $userData, int $userId): array
    {
        array_walk_recursive($userData, function (&$value, $key) use ($userId) {
            if (filter_var($value, FILTER_VALIDATE_URL) !== false) {
                $tempDirPath = sys_get_temp_dir();
                $fileContent = Http::get($value)->body();
                $fileName = basename($value);
                $tempFilePath = "$tempDirPath/$fileName";

                file_put_contents($tempFilePath, $fileContent);

                $file = new UploadedFile(
                    $tempFilePath,
                    $fileName,
                    test: true
                );

                $filePath = $file->move(public_path("uploads/$userId/"), $fileName)->getPathname();

                $value = $filePath;
            }
        });

        return $userData;
    }

    private function writeUserToCsv(User $user, string $airtableId): void
    {
        $data = [
            $airtableId,
            $user->id,
            $user->name,
            $user->email,
            $user->created_at,
            $user->updated_at
        ];

        $csvFile = fopen(public_path(self::FILE_NAME), 'a+b');
        fputcsv($csvFile, $data);
        fclose($csvFile);
    }
}
