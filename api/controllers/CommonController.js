/**
 * CommonController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const fs = require('fs')
 generateName = function () {
    // action are perform to generate random name for every file
    var uuid = require('uuid');
    var randomStr = uuid.v4();
    var date = new Date();
    var currentDate = date.valueOf();
  
    retVal = randomStr + currentDate;
    return retVal;
  };
  
module.exports = {
  
    uploadImage: async (req, res) => {
        var modelName = req.param('modelName');
        try {
          req
            .file('file')
            .upload(
              { maxBytes: 5242880, dirname: '../../assets/images/' + modelName },
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
    //console.log('ok---------------')
                var responseData = {};
                file.forEach(async (element, index) => {
                  var name = generateName();
                  //console.log(element.fd);
                  typeArr = element.type.split('/');
                  fileExt = typeArr[1];
                  var orignalName = element.filename;
    
                  if (
                    fileExt === 'jpeg' ||
                    fileExt === 'JPEG' ||
                    fileExt === 'JPG' ||
                    fileExt === 'jpg' ||
                    fileExt === 'PNG' ||
                    fileExt === 'png'
                  ) {
                    fs.readFile(file[index].fd, async (err, data) => {
                      if (err) {
                        return res.status(403).json({
                          success: false,
                          error: {
                            code: 403,
                            message: err,
                          },
                        });
                      } else {
                        if (data) {
                          var path = file[index].fd;
                          fs.writeFileSync(
                            'assets/images/' +
                              modelName +
                              '/' +
                              name +
                              '.' +
                              fileExt,
                            data,
                            function (err, image) {
                              if (err) {
                                ;
                                return res.status(400).json({
                                  success: false,
                                  error: {
                                    code: 400,
                                    message: err,
                                  },
                                });
                              }
                            }
                          );
    
                          responseData.fullpath = name + '.' + fileExt;
                          responseData.imagePath =
                            'images/' + modelName + '/' + name + '.' + fileExt;
    
                           
                       
                      
    
                          if (index == file.length - 1) {
                            await new Promise((resolve) =>
                              setTimeout(resolve, 6000)
                            ); //Because file take times to write in .tmp folder
                            fs.unlink(file[index].fd, function (err) {
                              if (err) throw err;
                            });
                            return res.json({
                              success: true,
                              data: responseData,                             
                             message: "Image uploaded successfully"
                            });
                          }
                        }
                      }
                    }); //end of loop
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
              }
            );
        } catch (err) {
          ;
          return res
            .status(500)
            .json({ success: false, error: { code: 500, message: '' + err } });
        }
      },

      changeStatus: function (req, res) {
        try {
          var modelName = req.param('model');
          var Model = sails.models[modelName];
          var itemId = req.param('id');
          var updated_status = req.param('status');
    
          let query = {};
          query.id = itemId;
    
          Model.findOne(query).exec(function (err, data) {
            if (err) {
              return res.json({
                success: false,
                error: {
                  code: 400,
                  message: constantObj.messages.DATABASE_ISSUE,
                },
              });
            } else {
              Model.update(
                {
                  id: itemId,
                },
                {
                  status: updated_status,
                },
                function (err, response) {
                  if (err) {
                    return res.json({
                      success: false,
                      error: {
                        code: 400,
                        message: '' + err,
                      },
                    });
                  } else {
                    return res.json({
                      success: true,
                      code: 200,
                      message: "Status changed successfully.",
                    });
                  }
                }
              );
            }
          });
        } catch (err) {
          ;
          return res
            .status(400)
            .json({ success: false, error: err, message: 'Server Error' });
        }
      },
    
      commonDelete: function (req, res) {
        try {
          var modelName = req.param('model');
          var Model = sails.models[modelName];
          var itemId = req.param('id');
    
          let query = {};
          query.id = itemId;
    
          Model.findOne(query).exec(async (err, data) => {
            if (err) {
              return res.json({
                success: false,
                error: {
                  code: 400,
                  message: constantObj.messages.DATABASE_ISSUE,
                },
              });
            } else {
         
    
        
              Model.update(
                {
                  id: itemId,
                },
                {
                  isDeleted: true,
                  deletedBy: req.identity.id,
                  deletedAt: new Date(),
                },
                function (err, response) {
                  if (err) {
                    return res.json({
                      success: false,
                      error: {
                        code: 400,
                        message: constantObj.messages.DATABASE_ISSUE,
                      },
                    });
                  } else {
                    return res.json({
                      success: true,
                      code: 200,
                      message: "Record deleted successfully."
                    });
                  }
                }
              );
            }
          });
        } catch (err) {
          ;
          return res
            .status(400)
            .json({ success: false, error: err, message: 'Server Error' });
        }
      },
};

