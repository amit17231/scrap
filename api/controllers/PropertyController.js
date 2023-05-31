/**
 * PropertyController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */



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
    
    
          query.isDeleted = false
    
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
      }
};

