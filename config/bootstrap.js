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
    {name:"161A Punggol Central",location:[1.3936,103.9135],address:"PE4/CP3 Riviera LRT",description:"This flat is a 5 Rooms HDB for sale with 2 Baths in 161A Punggol Central, a stunning HDB Resale Flat in Singapore.",contactPerson:"Lui Yen Yuin",price:699999, images:["https://sg1-cdn.pgimgs.com/listing/24523430/UPHO.141992609.V550/161A-Punggol-Central-Hougang-Punggol-Sengkang-Singapore.jpg","https://sg1-cdn.pgimgs.com/listing/24523430/UPHO.141992624.V550/161A-Punggol-Central-Hougang-Punggol-Sengkang-Singapore.jpg","https://sg1-cdn.pgimgs.com/listing/24523430/UPHO.141992621.V550/161A-Punggol-Central-Hougang-Punggol-Sengkang-Singapore.jpg","https://sg1-cdn.pgimgs.com/listing/24523430/UPHO.141992623.V550/161A-Punggol-Central-Hougang-Punggol-Sengkang-Singapore.jpg"],isDeleted:false},
    {name:"751 Pasir Ris Street 71",location:[1.3780719357,103.933861256],address:"751 Pasir Ris Street 71",description:"*RARE 5I Unit with Huge Study Room that can be converted into a Bedroom*",contactPerson:"Zen Neo",price:668888, images:["https://sg1-cdn.pgimgs.com/listing/24512369/UPHO.141864042.V550/751-Pasir-Ris-Street-71-Pasir-Ris-Tampines-Singapore.jpg","https://sg1-cdn.pgimgs.com/listing/24512369/UPHO.141864043.V550/751-Pasir-Ris-Street-71-Pasir-Ris-Tampines-Singapore.jpg","https://sg1-cdn.pgimgs.com/listing/24512369/UPHO.141864044.V550/751-Pasir-Ris-Street-71-Pasir-Ris-Tampines-Singapore.jpg","https://sg1-cdn.pgimgs.com/listing/24512369/UPHO.141864045.V550/751-Pasir-Ris-Street-71-Pasir-Ris-Tampines-Singapore.jpg","https://sg1-cdn.pgimgs.com/listing/24512369/UPHO.141864046.V550/751-Pasir-Ris-Street-71-Pasir-Ris-Tampines-Singapore.jpg"],isDeleted:false},
     {name:"Principal Garden",address:"",location:[1.2894,103.8170],description:`**** Principal Garden ***

Nestled in a quiet enclave overlooking the Alexandra Canal, Principal Garden sits on the frontier of the embassy district, Bishopgate, Alexandra and the Chatsworth Park Good Class Bungalow estate. The development is comprised of 663 units set over 4 elevated towers. Its novel “80-20 garden living” concept creates a green and tranquil environment despite Principal Garden Residents being able to be in the CBD – via car, MRT or bicycle in 20 minutes. The development also comes with many facilities, including tennis court, half basketball court and a 50 metre lap pool. UOL Group Limited (UOL) is Singapore’s leading public-listed property companies with an widespread portfolio of development, hotels, serviced suites and investment properties. They own and/or manages over 30 hotels throughout Asia, North America and Oceania through its hotel subsidiary called Pan Pacific Hotels Group Limited.Kheng Leong Group started as a global commodity & a spice trading company which later evolved into an investment group with passion for real estate investment and property development. Currently, the group has a bold portfolio of projects with strategic partners across the Asia Pacific as well as in Sydney, London and Los Angeles in the United States.

Principal Garden – Unique Selling Points

A notable feature of Principal Garden is its “80-20 garden living” concept. In effect, this means that all of the towers and facilities associated with the development occupy only 20 percent or less of the project’s total land area. A huge ribbon of lawn weaves through the whole development, highlighting the spaciousness and connecting the various gardens that give the development its name.`,contactPerson:"Fransiska Tan",mobileNo:"",price:950000, images:["https://sg1-cdn.pgimgs.com/listing/23541529/UPHO.137933672.V800/Principal-Garden-Alexandra-Commonwealth-Singapore.jpg",'https://sg1-cdn.pgimgs.com/listing/23541529/UPHO.137933674.V800/Principal-Garden-Alexandra-Commonwealth-Singapore.jpg',"https://sg1-cdn.pgimgs.com/listing/23541529/UPHO.137933673.V550/Principal-Garden-Alexandra-Commonwealth-Singapore.jpg","https://sg1-cdn.pgimgs.com/listing/23541529/UPHO.129373802.V550/Principal-Garden-Alexandra-Commonwealth-Singapore.jpg","https://sg1-cdn.pgimgs.com/listing/23541529/UPHO.129373814.V550/Principal-Garden-Alexandra-Commonwealth-Singapore.jpg"]},
    // {name:"",address:"",description:"",contactPerson:"",price:950000, images:[]},
    // {name:"",address:"",description:"",contactPerson:"",price:"", images:[]},
    // {name:"",address:"",description:"",contactPerson:"",price:"", images:[]},
    // {name:"",address:"",description:"",contactPerson:"",price:"", images:[]},
    // {name:"",address:"",description:"",contactPerson:"",price:"", images:[]},
    // {name:"",address:"",description:"",contactPerson:"",price:"", images:[]},
    // {name:"",address:"",description:"",contactPerson:"",price:"", images:[]},
    // {name:"",address:"",description:"",contactPerson:"",price:"", images:[]},
    ]);
  }


  var cron = require('node-cron');

cron.schedule('0 */2 * * *', () => {
  const Controller = require('../api/controllers/ScrapController')
console.log("cron running")
  Controller.scrapPropertyGruru().then(data={

  })
});

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
