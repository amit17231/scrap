/**
 * ScrapController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */



// const axios = require('axios');
// const cheerio = require('cheerio');
// const NodeGeocoder = require('node-geocoder');

// Set up geocoder
// const options = {
//   provider: 'google',
//   apiKey: 'AIzaSyAE33JQsa*g30mJgZSjtcu6zt9iQ1tIe', // Replace with your actual Google Maps API key
// };

// const geocoder = NodeGeocoder(options);
module.exports = {

  scrapPropertyGruru: async (req, resp) => {



    try {
      const axios = require('axios');
      const cheerio = require('cheerio');
      for (let index = 0; index < 10; index++) {
        url = `https://www.iproperty.com.sg/sale/?page=${index}`
      furl = url
      axios.get(furl)
        .then(async (response) => {
          // console.log(response.data)
          const data = response.data
          const $ = cheerio.load(data);
          const sdata = $('.sc-fubCfw');
          const jdata = [];

          sdata.each(async(index, element) => {
            const link = $(element).find('a.ui-atomic-link').attr('href');
            const img = $(element).find('img.ui-atomic-image').attr('src');
            const title = $(element).find('h2.ui-atomic-text').text();
            const price = $(element).find('h3.ui-atomic-text').text();
       
            const agent  = $(element).find('h2.ui-atomic-text.ui-atomic-text--styling-heading-6.ui-atomic-text--typeface-primary').text()
            if (link) {
              axios.get(link)
                .then(async (response) => {
                  const html = response.data;
                  const $ = cheerio.load(html);

                  const address = $('span.o-iprop-listing-summary__address-info').text().trim();
                  const description = $('p.ui-atomic-text.ui-atomic-text--styling-default.ui-atomic-text--typeface-primary').text().trim();
                  // const agent = $('h2.ui-organism-listing-inquiry-r123__agent-contact-name').text().trim();
                  const mobileNumber = $('div.ui-atomic-ellipsis').text().trim()
        
                  // Output the scraped data
                
                  // itm.agent = agent
                  // itm.mobileNumber = mobileNumber
                  // itm.address = address
                  // itm.description = description

                  // const cordinates =await  getLatLong(address)
                 let itm = {name:title,images:[img],description:description,price:price,address:address,location:[1.3521,103.81]}

                 const property = await Property.findOne({name:itm.name,isDleted:false})

                 if(!property){
                   const created = await Property.create(itm)
                 }
                })
                .catch(error => {
                  // console.log(error);
                });

                
            }

          });



        })
        .catch(error => {
          // console.log(error);
        });

        
      }
     

    } catch (error) {
      console.error('Error:', error.message, "error");
    }

  }
};

// async function getLatLong(address) {
//   console.log(address)
//   geocoder.geocode(address)
//   .then((res) => {
//     if (res.length > 0) {
//       const { latitude, longitude } = res[0];
//       console.log(`Latitude: ${latitude}`);
//       console.log(`Longitude: ${longitude}`);
//     } else {
//       console.log('Address not found.');
//     }
//   })
//   .catch((err) => {
//     console.error('Error:', err);
//   });
// }

// function extractNumericsFromString(str) {
//   console.log(str)
//   const regex = /\d+(\.\d+)?/g;
//   return str.match(regex);
// }