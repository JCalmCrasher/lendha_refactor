<?php

use App\Http\Controllers\Horizon\HorizonController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/


Route::group(['route' => 'horizon'], function () {
    Route::post('login', [HorizonController::class, 'login'])->name('horizon.login');

    Route::get('horizon_login_blacker', function () {
        return view('horizonlogin');
    })->name('horizon_login_blacker');
});

Route::view('/{path?}', 'app')->where('path', '.*');


// Route::get('/', function () {
//     return view('welcome');
// });
