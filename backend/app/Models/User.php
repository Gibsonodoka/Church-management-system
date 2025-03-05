<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // Added role field
        'team', // Added team field (only for team heads)
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => 'string',
            'team' => 'string',
        ];
    }

    /**
     * Check if the user has a specific role.
     */
    public function hasRole($role)
    {
        return $this->role === $role;
    }

    /**
     * Check if the user belongs to a specific team.
     */
    public function isInTeam($team)
    {
        return $this->team === $team;
    }

    /**
     * Role-based access helper methods.
     */
    public function isSuperAdmin()
    {
        return $this->role === 'Super Admin';
    }

    public function isSeniorPastor()
    {
        return $this->role === 'Senior Pastor';
    }

    public function isPastor()
    {
        return $this->role === 'Pastor';
    }

    public function isTeamHead()
    {
        return in_array($this->role, ['Media', 'Ushering', 'Visitation', 'Music', 'Finance']);
    }

    /**
     * Get the team name for team heads.
     */
    public function getTeamName()
    {
        return $this->isTeamHead() ? $this->team : null;
    }
}
