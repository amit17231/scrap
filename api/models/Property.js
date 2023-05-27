/**
 * Property.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name:{
      type:"string"
    },
    description:{
      type:"string"
    },
    images:{
      type:"json"
    },
    address:{
      type:"string"
    },
    city:{
      type:"string"
    },
    state:{
      type:"string"
    },
    country:{
      type:"string"
    },
    pincode:{
      type:"string"
    },

    contactNumber:{
      type:"string"
    },

    propertyType:{
      type:"string"
    },
    price:{
      "type":"number"
    },

    location:{
      typr:"json"
    },
    bedrooms:{
      type:"number"
    },
    bathroom:{
      type:"number"
    },

    status: {
      type: 'string',
      isIn: ['active', 'deactive'],
      defaultsTo: 'active'
    },

    isDeleted: {
      type: 'Boolean',
      defaultsTo: false
    },
  },

};

