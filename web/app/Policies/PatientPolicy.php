<?php

namespace App\Policies;

use App\Models\Patient;
use App\Models\User;

class PatientPolicy
{
    public function view(User $user, Patient $patient): bool
    {
        if ($user->isAdmin() || $user->isDoctor()) {
            return true;
        }

        return $user->id === $patient->user_id;
    }

    public function update(User $user, Patient $patient): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->id === $patient->user_id;
    }

    public function delete(User $user, Patient $patient): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->id === $patient->user_id;
    }
}
