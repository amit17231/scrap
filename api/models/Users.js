/**
 * Users.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
var bcrypt = require('bcrypt-nodejs');
module.exports = {




  attributes: {
    // schema: true,
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    fullName: {
      type: 'string',

    },

    email: {
      type: 'string',
      isEmail: true,
    },
    mobileNo: {
      type: 'ref',
      columnType: 'bigint',
    },
    image: {
      type: 'string',
    },
    password: {
      type: 'string',
      columnName: 'encryptedPassword',
      minLength: 8
    },
    isVerified: {
      type: 'string',
      isIn: ['Y', 'N'],
      defaultsTo: 'N'
    },
    role: {
      type: 'string',

    },


    verificationCode: {
      type: 'string'
    },

    status: {
      type: 'string',
      isIn: ['active', 'deactive'],
      defaultsTo: 'deactive'
    },
    domain: {
      type: 'string',
      isIn: ['web', 'ios', 'andriod'],
      defaultsTo: 'web'
    },

    customer_id: {
      type: 'string',

    },

    isDeleted: {
      type: 'Boolean',
      defaultsTo: false
    },
    planType: {
      type: 'string'
    },
    price: {
      type: 'number'
    },
    planName: {
      type: 'string'
    },
    // plan_id:{
    //     model:'plans'
    // },
    validFrom: {
      type: 'string'
    },
    validupto: {
      type: 'string'
    },
    addedBy: {
      model: 'users'
    },
    deletedBy: {
      model: 'users'
    },
    updatedBy: {
      model: 'users'
    },


  },

  beforeCreate: function (user, next) {
    if (user.firstName && user.lastName) {
      user.fullName = user.firstName + ' ' + user.lastName;
    }

    if (user.hasOwnProperty('password')) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
      next(false, user);

    } else {
      next(null, user);
    }
  },
  authenticate: function (email, password) {
    console.log("in auth    ")
    var query = {};
    query.email = email;
    query.$or = [{ roles: ["SA", "A"] }];

    return Users.findOne(query).populate('roleId').then(function (user) {
      //return API.Model(Users).findOne(query).then(function(user){
      return (user && user.date_verified && user.comparePassword(password)) ? user : null;
    });
  },
  customToJSON: function () {
    // Return a shallow copy of this record with the password and ssn removed.
    return _.omit(this, ['password', 'verificationCode'])
  }

}



