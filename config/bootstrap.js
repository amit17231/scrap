/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

const smtpTransport = require("nodemailer-smtp-transport");
const { scrapPropertyGruru } = require("../api/controllers/ScrapController");

module.exports.bootstrap = async function() {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //

  /**Seeding the user in db  */
  Users.find({}).then(async user=>{
    if(user.length == 0){
      await Users.createEach([
        { email: 'amit@yopmail.com', firstName: 'Amit', lastName: 'Kumar', status:'active',password:'amit@17231',isVerified:'Y',date_verified: new Date(), role:'admin' },
        { email: 'user@yopmail.com', firstName: 'Amit', lastName: 'Kumar', status:'active',password:'amit@17231',isVerified:'Y',date_verified: new Date(), role:'user' }
      
        // etc.
      ]);
    }
  })

  if(await Property.count() == 0){
    await Property.createEach([
    {name:"161A Punggol Central",address:"PE4/CP3 Riviera LRT",description:"This flat is a 5 Rooms HDB for sale with 2 Baths in 161A Punggol Central, a stunning HDB Resale Flat in Singapore.",contactPerson:"Lui Yen Yuin",price:699999, images:["https://sg1-cdn.pgimgs.com/listing/24523430/UPHO.141992609.V550/161A-Punggol-Central-Hougang-Punggol-Sengkang-Singapore.jpg","https://sg1-cdn.pgimgs.com/listing/24523430/UPHO.141992624.V550/161A-Punggol-Central-Hougang-Punggol-Sengkang-Singapore.jpg","https://sg1-cdn.pgimgs.com/listing/24523430/UPHO.141992621.V550/161A-Punggol-Central-Hougang-Punggol-Sengkang-Singapore.jpg","https://sg1-cdn.pgimgs.com/listing/24523430/UPHO.141992623.V550/161A-Punggol-Central-Hougang-Punggol-Sengkang-Singapore.jpg"],isDeleted:false},
    {name:"751 Pasir Ris Street 71",address:"751 Pasir Ris Street 71",description:"*RARE 5I Unit with Huge Study Room that can be converted into a Bedroom*",contactPerson:"Zen Neo",price:668888, images:["https://sg1-cdn.pgimgs.com/listing/24512369/UPHO.141864042.V550/751-Pasir-Ris-Street-71-Pasir-Ris-Tampines-Singapore.jpg","https://sg1-cdn.pgimgs.com/listing/24512369/UPHO.141864043.V550/751-Pasir-Ris-Street-71-Pasir-Ris-Tampines-Singapore.jpg","https://sg1-cdn.pgimgs.com/listing/24512369/UPHO.141864044.V550/751-Pasir-Ris-Street-71-Pasir-Ris-Tampines-Singapore.jpg","https://sg1-cdn.pgimgs.com/listing/24512369/UPHO.141864045.V550/751-Pasir-Ris-Street-71-Pasir-Ris-Tampines-Singapore.jpg","https://sg1-cdn.pgimgs.com/listing/24512369/UPHO.141864046.V550/751-Pasir-Ris-Street-71-Pasir-Ris-Tampines-Singapore.jpg"],isDeleted:false},
    // {name:"",address:"",description:"",contactPerson:"",price:"", images:[]},
    // {name:"",address:"",description:"",contactPerson:"",price:"", images:[]},
    // {name:"",address:"",description:"",contactPerson:"",price:"", images:[]},
    // {name:"",address:"",description:"",contactPerson:"",price:"", images:[]},
    // {name:"",address:"",description:"",contactPerson:"",price:"", images:[]},
    // {name:"",address:"",description:"",contactPerson:"",price:"", images:[]},
    // {name:"",address:"",description:"",contactPerson:"",price:"", images:[]},
    // {name:"",address:"",description:"",contactPerson:"",price:"", images:[]},
    // {name:"",address:"",description:"",contactPerson:"",price:"", images:[]},
    ]);
  }

  /**Seeding SMTP Detail into db */

  // if(await Smtp.count() == 0){
  //   var smtp = await Smtp.create({"service" : "Gmail",
  //   "host" : "smtp.gmail.com",
  //   "port" : 587,
  //   "debug" : true,
  //   "sendmail" : true,
  //   "requiresAuth" : true,
  //   "domains" : [ 
  //       "gmail.com", 
  //       "googlemail.com"
  //   ],
  //   "user" : "amitkjcsoftwaresolution@gmail.com",
  //   "pass" : "iqzipnrnnuvgglvv"})
  // }
  
  // ```

};
