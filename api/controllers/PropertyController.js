/**
 * PropertyController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const xlsx = require('xlsx');

module.exports = {
  
    addProperty: async(req, res)=>{
        try{
            const data = req.body

            if(data.lat && data.lng){
                data.location = [data.lat,data.lng]
            }
            console.log(data)
            const created = await Property.create(data).fetch()

            return res.status(200).json({
                success:true,
                created:created,
                message:"Property added successfully."
            })
        }catch(err){

        }
    },


    getProperties: async (req, res) => {
        console.log("In Get all property");
        try {
          var search = req.param('search');
          var page = req.param('page');
          let propertyType = req.param('propertyType')
          if (!page) {
            page = 1
          }
          var count = parseInt(req.param('count'));
          if (!count) {
            count = 10
          }
          var skipNo = (page - 1) * count;
          var query = {};
        //   if (search) {
        //     query.or = [
        //       { fullName: { $regex: search, '$options': 'i' } },
        //       { email: { $regex: search, '$options': 'i' } },
        //       { name: { $regex: search, '$options': 'i' } }
        //     ]
        //   }

        if (search) {
          query.or = [
            { name:  {
              'like': '%' + search + '%'
          } },
            { description:  {
              'like': '%' + search + '%'
          } },
          
          ]
        }
    
    
          query.isDeleted = false
          if(propertyType){query.propertyType = propertyType}
          console.log(query,"----")
          const total = await Property.count(query)
          const data = await Property.find(query).skip(skipNo).limit(count)
          return res.status(200).json({
            "success": true,
            "data": data,
            "total": total,
          });
          // db.collection('users').aggregate([
    
          //     {
          //         $lookup: {
          //             from: 'users',
          //             localField: 'deletedBy',
          //             foreignField: '_id',
          //             as: "deletedBy"
          //         }
          //     },
          //     {
          //         $unwind: {
          //             path: '$deletedBy',
          //             preserveNullAndEmptyArrays: true
          //         }
          //     },
          //     {
          //         $project: {
          //             role: "$role",
          //             isDeleted: "$isDeleted",
          //             fullName: "$fullName",
          //             name: "$name",
          //             email: "$email",
          //             status: "$status",
          //             createdAt: "$createdAt",
          //             deletedBy: "$deletedBy.fullName",
          //             deletedAt: '$deletedAt'
    
          //         }
          //     },
          //     {
          //         $match: query
          //     },
          // ]).toArray((err, totalResult) => {
    
          //     db.collection('users').aggregate([
    
          //         {
          //             $lookup: {
          //                 from: 'users',
          //                 localField: 'deletedBy',
          //                 foreignField: '_id',
          //                 as: "deletedBy"
          //             }
          //         },
          //         {
          //             $unwind: {
          //                 path: '$deletedBy',
          //                 preserveNullAndEmptyArrays: true
          //             }
          //         },
          //         {
          //             $project: {
          //                 role: "$role",
          //                 isDeleted: "$isDeleted",
          //                 fullName: "$fullName",
          //                 name: "$name",
          //                 email: "$email",
          //                 status: "$status",
          //                 createdAt: "$createdAt",
          //                 deletedBy: "$deletedBy.fullName",
          //                 deletedAt: '$deletedAt'
    
          //             }
          //         },
          //         {
          //             $match: query
          //         },
          //         {
          //             $sort: {
          //                 createdAt: -1
          //             }
          //         },
    
          //         {
          //             $skip: Number(skipNo)
          //         },
          //         {
          //             $limit: Number(count)
          //         }
          //     ]).toArray((err, result) => {
          // return res.status(200).json({
          //     "success": true,
          //     "code": 200,
          //     "data": result,
          //     "total": totalResult.length,
          // });
          //     })
    
          // })
        } catch (error) {
          console.log(error)
          return res.status(400).json({
            "success": false,
    
            "error": { code: 400, message: "" + error },
          });
        }
      },

      propertyDetail: async (req, res)=>{
          const id = req.param('id')
          const property = await Property.findOne({id:id})
          return res.status(200).json({
              success:true,
              data:property
          })
      },

      updateProperty: async (req, res)=>{
          try{
            const data = req.body
            const id = req.param("id")
            if(data.lat && data.lng){
                data.location = [data.lat,data.lng]
            }
            delete data.id
            const updated = await Property.updateOne({id:id},data)
            return res.status(200).json({
                success:true,
                message:"Property updated successfully."
            })
          }catch(err){
              return res.status(400).json({
                  success:false,
                  error:{code:400,message:""+err}
              })
          }
      },

      uploadProperty: async (req, res)=>{
        var modelName = req.param('modelName');
    try {
      req
        .file('file')
        .upload(
          { maxBytes: 52428800000000, dirname: '../../assets/images/' + modelName },
          async (err, file) => {
            if (err) {
              if (err.code == 'E_EXCEEDS_UPLOAD_LIMIT') {
                return res.status(404).json({
                  success: false,
                  error: {
                    code: 404,
                    message: 'Image size must be less than 5 MB',
                  },
                });
              }
            }
          
            file.forEach(async (element, index) => {
              var name = generateName();
              //console.log(element.fd);
              typeArr = element.type.split('/');
              fileExt = typeArr[1];
              var orignalName = element.filename;

              if (
                fileExt
                // fileExt === 'jpeg' ||
                // fileExt === 'JPEG' ||
                // fileExt === 'JPG' ||
                // fileExt === 'jpg' ||
                // fileExt === 'PNG' ||
                // fileExt === 'png'
              ) {

                const workbook = xlsx.readFile(file[index].fd);

                 // Assuming first sheet is the one you want to read
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
              
                // Convert the sheet to JSON
                const data = xlsx.utils.sheet_to_json(worksheet);

                for await (let itm of data){
                  console.log(itm)

                  let dataToInsert = {}

                  dataToInsert.name = itm.name
                  dataToInsert.address = itm.address
                  dataToInsert.district = itm.district
                  dataToInsert.price = itm.price.split(" ")[1]
                  dataToInsert.propertyType = itm.property_type
                  dataToInsert.furnishing = itm.furnishing
                  dataToInsert.description = itm.description
                  dataToInsert.developer = itm.developer
                  dataToInsert.builtSize = itm.floor_area
                  dataToInsert.furnishing = itm.furnishing
                  dataToInsert.images = itm.images_list.replace(/{|}/g, '').split(',');
                  dataToInsert.name = itm.agent_name
                  dataToInsert.agent_name = itm.agent_name

                  let existed = await Property.find({name:dataToInsert.name, isDeleted:false})

                  if(existed && existed.length == 0){
                    await Property.create(dataToInsert)
                  }
                }

            
             
              } else {
                return res.status(404).json({
                  success: false,
                  error: {
                    code: 404,
                    message: 'Please upload a valid image file.',
                  },
                });
              }
            });

            return res.status(200).json({
              success:true,
              message:"File uploaded successfully Please wait 1 to 2 minutes for reflecting listing."
            })
          }
        );
    } catch (err) {
      ;
      return res
        .status(500)
        .json({ success: false, error: { code: 500, message: '' + err } });
    }
      }
};

