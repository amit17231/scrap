/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/

  // 'get /users': 'UsersController.getUsers'

  'post /admin/signin': 'UsersController.adminSignin',
  'get /profile': 'UsersController.ownProfileDetail',
  'get /user/detail': 'UsersController.userDetail',
  'put /change/password':"UsersController.changePassword",
  'put /edit/profile':"UsersController.editProfile",
  'post /forgot/password': 'UsersController.forgotPassword',
  'put /reset/password': 'UsersController.resetPassword',
  'post /add/user': 'UsersController.addUser',
  'post /register':'UsersController.register',
  'post /user/signin':'UsersController.userSignin',
  // 'post /users/forgot/password':'UsersController.'

  'get /users': 'UsersController.getAllUsers',
  'get /verifyUser':'UsersController.verifyUser',


  /**Common Routes */

  'post /upload/image':'CommonController.uploadImage',
  'put /change/status':'CommonController.changeStatus',
  'delete /delete':'CommonController.commonDelete',
  'post /upload/images':'CommonController.uploadMultipleImages',
  'post /upload/videos':'CommonController.uploadMultipleVideos',
  // 'get /dummy':'CommonController.continousHit',

  /** */

  // 'get /scrap':'ScrapController.scrapPropertyGruru'

  /**Property Routes */

  'post /property':"PropertyController.addProperty",
  'get /properties':"PropertyController.getProperties",
  'put /property':"PropertyController.updateProperty",
  'get /property':"PropertyController.propertyDetail",
  'post /import/property':"PropertyController.uploadProperty"
  


};
