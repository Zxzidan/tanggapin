<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard with tanggapin operational data', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('stats')
            ->has('priorityFeed')
            ->has('classes')
            ->has('cases')
            ->has('atsList')
            ->has('paymentList')
            ->has('dapodikIssues')
            ->has('incidents')
            ->where('stats.studentsNeedingAttention', 12)
        );
});
