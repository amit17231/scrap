/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

   '*': 'isAuthorized',

   UsersController:{
     'adminSignin':true,
     'forgotPassword':true,
     'resetPassword':true,
     'userSignin':true,
     'register':true,
     'verifyUser':true

   },

   PropertyController:{
    getProperties:true,
    propertyDetail:true

   }

};
