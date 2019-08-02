'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('user', 'UserController.store')

Route.post('sessions', 'SessionController.store')

Route.post('forgot-password', 'ForgotPasswordController.store')
Route.put('forgot-password', 'ForgotPasswordController.update')

Route.get('file/:id', 'FileController.show')
Route.post('file', 'FileController.store')
