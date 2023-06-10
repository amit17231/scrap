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
    videos:{
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
    dialCode:{
      type:"string"
    },

    contactNumber:{
      type:"string"
    },

    propertyType:{
      type:"string"
    },

    subType:{
      type:"string"
    },
    price:{
      "type":"string"
    },

    location:{
      type:"json"
    },

    district:{
      type:"string"
    },
    contactPerson:{
      type:"string"
    },
    contactPersonType:{
      type:"string"
    },
    estateName:{
      type:"string"
    },
    landArea:{
      type:"string"
    },
    currentPermissible:{
      type:"string"
    },
    gstRegisteredOwner:{
      type:"string"
    },
    tenancy:{
      type:"string"
    },
    developer:{
      type:"string"
    },
    psf:{
      type:"string"
    },
    floor:{
      type:"string"
    },
    floorLevel:{
      type:"string"
    },
    availability:{
      type:"string"
    },
    furnishing:{
      type:"string"
    },
    builtSize:{
      type:"string"
    },
    angkorTenant:{
      type:"string"
    },
    humanTraffic:{
      type:"string"
    },
    electricity:{
      type:"string"
    },
    listingDate:{
      type:"string"
    },
    aircondition:{
      type:"string"
    },
    pantry:{
      type:"string"
    },
    restRoom:{
      type:"string"
    },
    waterOutlet:{
      type:"string"
    },
    cctv:{
      type:"string"
    },
    security:{
      type:"string"
    },
    clubHouse:{
      type:"string"
    },
    gym:{
      type:"string"
    },
    pool:{
      type:"string"
    },
    buildingDetail:{
      type:"string"
    },
    parking:{
      type:"string"
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

