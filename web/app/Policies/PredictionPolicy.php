<?php

namespace App\Policies;

use App\Models\Prediction;
use App\Models\User;

class PredictionPolicy
{
    public function view(User $user, Prediction $prediction): bool
    {
        if ($user->isAdmin() || $user->isDoctor()) {
            return true;
        }

        return $user->id === $prediction->user_id;
    }

    public function addVerdict(User $user, Prediction $prediction): bool
    {
        return $user->isDoctor();
    }
}
