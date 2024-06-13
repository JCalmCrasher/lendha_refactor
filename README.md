## About Lendha

Lendha is a web app built with Laravel and React. The Laravel routing is API based.

## Installation Instructions

### Pre-requisites

The following items are required before installing the Lendha app:

* PHP
	* BCMath PHP Extension
	* Ctype PHP Extension
	* JSON PHP Extension
	* Mbstring PHP Extension
	* OpenSSL PHP Extension
	* PDO PHP Extension
	* Tokenizer PHP Extension
	* XML PHP Extension
* Composer
* MySQL
* npm

### Installation Guide

1. Create a Database (for the purpose of this doc I will call it `lendha_db`)
2. Assign a user to the database (let us use `lendha_user` and `lendha_password`)
3. Clone the Lendha app from github
4. Navigate to the location of the app on your PC
5. Run `composer install` to install laravel dependencies
6. Create a .env file 
7. Copy the contents of the .env.example file and paste in the just created .env file
8. Modify the `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` to suit the values created in 1 and 2 above
9. Run `php artisan migrate --seed` to create and populate the necessary database tables.
10. Run `php artisan passport:install`
11. Run `npm install && npm run dev` to install npm dependencies and compile the development code.
12. Run `php artisan serve` to run the code on your browser
13. Navigate to `http://127.0.0.1:8000` (or whichever url is provided after serving) to view your code.

## Live Code
You can see Lendha in action [here](https://lendha.com)
