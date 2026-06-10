<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Promotion;
use Carbon\Carbon;

class DeactivateExpiredPromotions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'promotions:deactivate-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Deactivate promotions that have expired';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $expired = Promotion::where('is_active', true)
            ->whereDate('end_date', '<', Carbon::now())
            ->update(['is_active' => false]);

        $this->info("Deactivated {$expired} expired promotion(s).");

        return 0;
    }
}