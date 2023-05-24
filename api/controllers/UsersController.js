/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


const bcrypt = require('bcrypt-nodejs');
var constantObj = sails.config.constants;
var constant = require('../../config/local.js');
const SmtpController = require('../controllers/SmtpController');
const db = sails.getDatastore().manager

generateVeificationCode = function () {
  // action are perform to generate VeificationCode for user
  var length = 9,
    charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    retVal = '';

  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};


module.exports = {


  /**
   * 
   * @param {*} req 
   * @param {*} res 
   * @returns 
   * @description Used to register User
   * @createdAt 02/Dec/2022
   */
  register: async (req, res) => {

    if ((!req.body.email) || typeof req.body.email == undefined) {
      return res.status(404).json({ "success": false, "error": { "code": 404, "message": constantObj.user.EMAIL_REQUIRED } });
    }
    if ((!req.body.password) || typeof req.body.password == undefined) {
      return res.status(404).json({ "success": false, "error": { "code": 404, "message": constantObj.user.PASSWORD_REQUIRED } });
    }
    var date = new Date();
    try {
      var user = await Users.findOne({ email: req.body.email.toLowerCase() });
      if (user) {
        return res.status(400).json({ "success": false, "error": { "code": 400, "message": constantObj.user.EMAIL_EXIST } });
      } else {
        req.body['date_registered'] = date;
        req.body['date_verified'] = date;
        req.body["status"] = "active";
        req.body["role"] = "user";

        if (req.body.firstName && req.body.lastName) {
          req.body["fullName"] = req.body.firstName + ' ' + req.body.lastName
        }


        var newUser = await Users.create(req.body).fetch()
        if (newUser) {
          userVerifyLink({
            email: newUser.email,
            fullName: newUser.fullName,
            id: newUser.id
          })

          return res.status(200).json({
            "success": true,
            "code": 200,
            "data": newUser,
            "message": constantObj.user.SUCCESSFULLY_REGISTERED,
          });
        }
      }
    } catch (err) {
      return res.status(400).json({ "success": true, "code": 400, "error": err, });
    }
  },

  /**
   * 
   * @reqBody  : {email,password}
   * @param {*} res 
   * @returns 
   */
  adminSignin: async (req, res) => {

    if ((!req.body.email) || typeof req.body.email == undefined) {
      return res.status(404).json({ "success": false, "error": { "code": 404, "message": constantObj.user.EMAIL_REQUIRED } });
    }

    if ((!req.body.password) || typeof req.body.password == undefined) {
      return res.status(404).json({ "success": false, "error": { "code": 404, "message": constantObj.user.PASSWORD_REQUIRED } });
    }

    var user = await Users.findOne({ email: req.body.email.toLowerCase(), isDeleted: false });


    if (user && user.status == 'deactive') {
      return res.status(404).json({ "success": false, "error": { "code": 404, "message": constantObj.user.USERNAME_INACTIVE } });
    }

    if (user && user.status != "active" && user.isVerified != "Y") {
      return res.status(404).json({ "success": false, "error": { "code": 404, "message": constantObj.user.USERNAME_INACTIVE } });
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(404).json({ "success": false, "error": { "code": 404, "message": constantObj.user.WRONG_PASSWORD } });
    } else {

      var token = jwt.sign({ user_id: user.id, firstName: user.firstName },
        { issuer: 'Amit Kumar', subject: user.email, audience: "public" })

      user.access_token = token;

      return res.status(200).json(
        {
          "success": true,
          "code": 200,
          "message": constantObj.user.SUCCESSFULLY_LOGGEDIN,
          "data": user
        });
    }
  },

  /*
  *changePassword
  */
  changePassword: async function (req, res) {
    if (!req.body.newPassword || typeof req.body.newPassword == undefined) {
      return res.status(404).json({
        success: false,
        error: { code: 404, message: constantObj.user.PASSWORD_REQUIRED },
      });
    }


    if (
      !req.body.currentPassword ||
      typeof req.body.currentPassword == undefined
    ) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: constantObj.user.CURRENTPASSWORD_REQUIRED,
        },
      });
    }
    let data = req.body;
    let newPassword = data.newPassword;
    let currentPassword = data.currentPassword;

    let query = {};
    query.id = req.identity.id;

    Users.findOne(query).then((user) => {
      if (!bcrypt.compareSync(currentPassword, user.password)) {
        return res.status(404).json({
          success: false,
          error: { code: 404, message: constantObj.user.CURRENT_PASSWORD },
        });
      } else {
        var encryptedPassword = bcrypt.hashSync(
          newPassword,
          bcrypt.genSaltSync(10)
        );
        Users.update(
          { id: req.identity.id },
          { encryptedPassword: encryptedPassword }
        ).then(function (user) {
          return res.status(200).json({
            success: true,
            message: constantObj.user.PASSWORD_CHANGED,
          });
        });
      }
    });
  },


  /**
   * 
   * @param {*} req.body {email:"",password:""}
   * @param {*} res 
   * @returns detail of the user
   * @description: Used to signup for  user and event organizer
   */
  userSignin: async (req, res) => {

    if ((!req.body.email) || typeof req.body.email == undefined) {
      return res.status(404).json({ "success": false, "error": { "code": 404, "message": constantObj.user.EMAIL_REQUIRED } });
    }

    if ((!req.body.password) || typeof req.body.password == undefined) {
      return res.status(404).json({ "success": false, "error": { "code": 404, "message": constantObj.user.PASSWORD_REQUIRED } });
    }

    // , select: ['email', 'role', 'status', 'isVerified', 'password', 'firstName', 'lastName', 'fullName', 'image'] 
    var userDetails = await Users.find({ where: { email: req.body.email.toLowerCase(), isDeleted: false, role: req.body.role } });
    var user = userDetails[0];

    if (!user) {
      return res.status(404).json({ "success": false, "error": { "code": 404, "message": constantObj.user.INVALID_CRED } });
    }

    if (user && user.status != "active") {
      return res.status(404).json({ "success": false, "error": { "code": 404, "message": constantObj.user.USERNAME_INACTIVE } });

    }
    if (user.isVerified == "N") {
      return res.status(404).json({ "success": false, "error": { "code": 404, "message": constantObj.user.USERNAME_VERIFIED } });

    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {

      return res.status(404).json({ "success": false, "error": { "code": 404, "message": constantObj.user.INVALID_CRED } });

    } else {
      /**Genreating access token for the user and event organizer*/
      var token = jwt.sign({ user_id: user.id, firstName: user.firstName },
        { issuer: 'Jcsoftware', subject: user.email, audience: "L3Time" })
      const refreshToken = jwt.sign({ user_id: user.id }, { issuer: 'refresh', subject: "user", audience: "L3Time" })

      user.access_token = token;
      user.refresh_token = refreshToken;
      return res.status(200).json({
        "success": true,
        "message": constantObj.user.SUCCESSFULLY_LOGGEDIN,
        "data": user
      });


    }
  },

  /*For Get User Details
  * Get Record from Login User Id
  */
  userDetails: async function (req, res) {
    var id = req.param('id');
    if ((!id) || typeof id == undefined) {
      return res.status(400).json({ "success": false, "error": { "code": 400, "message": "Id is required" } });
    }

    var userDetails = await Users.find({ where: { id: id } });

    return res.status(200).json(
      {
        "success": true,
        "code": 200,
        "data": userDetails
      });
  },



  /*For Get all Users
  * Param Role
  */


  getAllUsers: async (req, res) => {
    console.log("In Get all user");
    try {
      var search = req.param('search');
      var role = req.param('role');
      var isDeleted = req.param('isDeleted');
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
      // if (search) {
      //   query.or = [
      //     { fullName: { $regex: search, '$options': 'i' } },
      //     { email: { $regex: search, '$options': 'i' } },
      //     { name: { $regex: search, '$options': 'i' } }
      //   ]
      // }
      // query.role = { $ne: 'admin' };
      query.role = { '!=': 'admin' };
      if (role) {
        query.role = role;
      }

      query.isDeleted = false


      const total = await Users.count(query)
      const users = await Users.find(query).skip(skipNo).limit(count)
      return res.status(200).json({
        "success": true,
        "data": users,
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

  /*
  *For Check Email Address Exit or not
  */
  checkEmail: async function (req, res) {
    var email = req.param('email');
    if ((!email) || typeof email == undefined) {
      return res.status(400).json({ "success": false, "error": { "code": 400, "message": "Email is required" } });
    }
    Users.findOne({ email: email }).then(user => {
      if (user) {
        return res.status(200).json({ "success": false, "error": { "code": 400, "message": "Email already taken" } });
      } else {
        return res.status(200).json({ "success": true, "code": 200, "message": "you can use this email" });
      }
    });
  },

  editProfile: async (req, res) => {
    const data = req.body;
    try {
      var id = req.param('id');

      if (!id || id == undefined) {
        return res.status(404).json({
          success: false,
          error: { code: 404, message: 'Id required' },
        });
      }

      if (data.firstName && data.lastName) {
        data.fullName = data.firstName + ' ' + data.lastName;
      }

      data.updatedBy = req.identity.id;
delete data.id
      Users.updateOne({ id: id }, data).then((user) => {
        return res.status(200).json({
          success: true,
          data: user,
          message: constantObj.user.UPDATED_USER,
        });
      });
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, error: { code: 400, message: '' + err } });
    }
  },

  forgotPassword: async (req, res) => {
    let data = req.body;
    if (!data.email || data.email == undefined) {
      return res.status(404).json({
        success: false,
        error: { code: 404, message: constantObj.user.USERNAME_REQUIRED },
      });
    }
    Users.findOne({ email: data.email.toLowerCase(), isDeleted: false }).then(
      (data) => {
        if (data === undefined) {
          return res.status(404).json({
            success: false,
            error: {
              code: 404,
              message: constantObj.user.INVALID_USER,
            },
          });
        } else {
          var verificationCode = generateVeificationCode();

          Users.update(
            { email: data.email, isDeleted: false },
            {
              verificationCode: verificationCode,
            }
          ).then(async (result) => {
            currentTime = new Date();
            await forgotPasswordEmail({
              email: data.email,
              verificationCode: verificationCode,
              firstName: data.firstName,
              id: data.id,
              time: currentTime.toISOString(),
            });
            return res.status(200).json({
              success: true,
              id: data.id,
              message: constantObj.user.VERIFICATION_SENT,
            });
          });
        }
      }
    );
  },

  resetPassword: async (req, res) => {
    let data = req.body;
    try {
      var code = data.code;
      var newPassword = data.newPassword;

      let user = await Users.findOne({ verificationCode: code });

      if (!user || user.verificationCode !== code) {
        //check for case senstive
        return res.status(404).json({
          success: false,
          error: {
            code: 404,
            message: 'Verification code wrong',
          },
        });
      } else {
        const encryptedPassword = bcrypt.hashSync(
          newPassword,
          bcrypt.genSaltSync(10)
        );
        Users.updateOne({ id: user.id }, { password: encryptedPassword }).then(
          (updatedUser) => {
            return res.status(200).json({
              success: true,
              message: 'Password reset successfully.',
            });
          }
        );
      }
    } catch (err) {
      return res
        .status(400)
        .json({ success: true, error: { code: 400, message: '' + err } });
    }
  },

  ownProfileDetail: async (req, res) => {
    try {
      let query = {};
      query.id = req.identity.id
      const userDetail = await Users.findOne(query)
      return res.status(200).json({
        "success": true,
        "data": userDetail
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: { code: 400, message: "" + err }
      })
    }



  },

  userDetail: (req, res, next) => {

    let query = {};
    query.id = req.param('id')
    Users.findOne(query).exec((err, userDetail) => {
      if (err) {
        return res.status(400).json({
          "success": false,
          "error": { "code": 400, "message": "" + err }
        });
      } else {
        return res.status(200).json({
          "success": true,
          "data": userDetail
        });
      }
    });
  },



  verifyUser: (req, res) => {
    var id = req.param('id')
    Users.findOne({ id: id }).then(user => {
      if (user) {
        Users.update({ id: id }, { isVerified: 'Y' }).then(verified => {
          return res.redirect(constant.FRONT_WEB_URL + "subscriptions")
        })
      } else {
        return res.redirect(constant.FRONT_WEB_URL)
      }
    })
  },

  verifyEmail: (req, res) => {
    console.log("in verifyEmail");
    var id = req.param('id')
    Users.findOne({ id: id }).then(user => {
      if (user) {
        Users.update({ id: id }, { contact_information: 'Yes' }).then(verified => {
          return res.redirect(constantObj.messages.FRONT_WEB_URL + "/auth/login")
        })
      } else {
        return res.redirect(constantObj.messages.FRONT_WEB_URL)
      }
    })
  },


  addUser: async (req, res) => {
    if (!req.body.email || typeof req.body.email == undefined) {
      return res.status(404).json({
        success: false,
        error: { code: 404, message: constantObj.user.EMAIL_REQUIRED },
      });
    }

    var date = new Date();
    try {
      var user = await Users.findOne({ email: req.body.email.toLowerCase() });
      if (user) {
        return res.status(400).json({
          success: false,
          error: { code: 400, message: constantObj.user.EMAIL_EXIST },
        });
      } else {
        req.body['date_registered'] = date;
        req.body['status'] = 'active';
        req.body['role'] = req.body.role ? req.body.role : 'user';
        const password = generateVeificationCode();
        req.body.password = password;
        req.body.isVerified = 'Y';

        if (req.body.firstName && req.body.lastName) {
          req.body['fullName'] = req.body.firstName + ' ' + req.body.lastName;
        }

        var newUser = await Users.create(req.body).fetch();
        if (newUser) {
          addUserEmail({
            email: newUser.email,
            firstName: newUser.firstName,
            password: password,
          });

          return res.status(200).json({
            success: true,
            code: 200,
            data: newUser,
            message: constantObj.user.SUCCESSFULLY_REGISTERED,
          });
        }
      }
    } catch (err) {
      return res.status(400).json({ success: true, code: 400, error: err });
    }
  },





};



userVerifyLink = function (options) {
  var email = options.email
  message = '';
  style = {
    header: `
       padding:30px 15px;
       text-align:center;
       background-color:#f2f2f2;
       `,
    body: `
       padding:15px;
       height: 230px;
       `,
    hTitle: `font-family: 'Raleway', sans-serif;
       font-size: 37px;
       height:auto;
       line-height: normal;
       font-weight: bold;
       background:none;
       padding:0;
       color:#333;
       `,
    maindiv: `
       width:600px;
       margin:auto;
       font-family: Lato, sans-serif;
       font-size: 14px;
       color: #333;
       line-height: 24px;
       font-weight: 300;
       border: 1px solid #eaeaea;
       `,
    textPrimary: `color:#3e3a6e;
       `,
    h5: `font-family: Raleway, sans-serif;
       font-size: 22px;
       background:none;
       padding:0;
       color:#333;
       height:auto;
       font-weight: bold;
       line-height:normal;
       `,
    m0: `margin:0;`,
    mb3: 'margin-bottom:15px;',
    textCenter: `text-align:center;`,
    btn: `padding:10px 30px;
       font-weight:500;
       font-size:14px;
       line-height:normal;
       border:0;
       display:inline-block;
       text-decoration:none;
       `,
    btnPrimary: `
       background-color:#3e3a6e;
       color:#fff;
       `,
    footer: `
       padding:10px 15px;
       font-weight:500;
       color:#fff;
       text-align:center;
       background-color:#000;
       `
  }

  message += `<div class="container" style="` + style.maindiv + `">
   <div class="header" style="`+ style.header + `text-align:center">
       <img src="http://198.251.65.146:4019/img/logo.png" width="150" style="margin-bottom:20px;" />
       <h2 style="`+ style.hTitle + style.m0 + `">Welcome to Application </h2>
   </div>
   <div class="body" style="`+ style.body + `">
       <h5 style="`+ style.h5 + style.m0 + style.mb3 + style.textCenter + `">Hello ` + options.fullName + `</h5>
       <p style="`+ style.m0 + style.mb3 + style.textCenter + `margin-bottom:20px;font-weight: 600">You are one step away from verifying your account and joining the L3Time  community.
       Please verify your account by clicking the link below.</p>
       <div style="`+ style.textCenter + `">
           <a style="text-decoration:none" href="` + constant.BACK_WEB_URL + "verifyUser?id=" + options.id + `"><span style="` + style.btn + style.btnPrimary + `">Verify Email</span></a>
       </div>
   </div>
   <div class="footer" style="`+ style.footer + `">
   &copy 2021 L3Time  All rights reserved.
   </div>
 </div>`



  SmtpController.sendEmail(email, 'Email Verification', message)
};


forgotPasswordEmail = function (options) {
  var email = options.email;
  var verificationCode = options.verificationCode;
  var firstName = options.firstName;

  if (!firstName) {
    firstName = email;
  }
  message = '';
  style = {
    header: `
            padding:30px 15px;
            text-align:center;
            background-color:#f2f2f2;
            `,
    body: `
            padding:15px;
            height: 230px;
            `,
    hTitle: `font-family: 'Raleway', sans-serif;
            font-size: 37px;
            height:auto;
            line-height: normal;
            font-weight: bold;
            background:none;
            padding:0;
            color:#333;
            `,
    maindiv: `
            width:600px;
            margin:auto;
            font-family: Lato, sans-serif;
            font-size: 14px;
            color: #333;
            line-height: 24px;
            font-weight: 300;
            border: 1px solid #eaeaea;
            `,
    textPrimary: `color:#3e3a6e;
            `,
    h5: `font-family: Raleway, sans-serif;
            font-size: 22px;
            background:none;
            padding:0;
            color:#333;
            height:auto;
            font-weight: bold;
            line-height:normal;
            `,
    m0: `margin:0;`,
    mb3: 'margin-bottom:15px;',
    textCenter: `text-align:center;`,
    btn: `padding:10px 30px;
            font-weight:500;
            font-size:14px;
            line-height:normal;
            border:0;
            display:inline-block;
            text-decoration:none;
            `,
    btnPrimary: `
            background-color:#3e3a6e;
            color:#fff;
            `,
    footer: `
            padding:10px 15px;
            font-weight:500;
            color:#fff;
            text-align:center;
            background-color:#000;
            `,
  };

  message +=
    `<div class="container" style="` +
    style.maindiv +
    `">
        <div class="header" style="` +
    style.header +
    `text-align:center">
            <img src="` +
    constant.FRONT_WEB_URL +
    `assets/img/logo.png" style="margin-bottom:20px;  width=100px;" />
            <h2 style="` +
    style.hTitle +
    style.m0 +
    `">Reset Password</h2>
        </div>
        <div class="body" style="` +
    style.body +
    `">
            <h5 style="` +
    style.h5 +
    style.m0 +
    style.mb3 +
    style.textCenter +
    `">Hello ` +
    firstName +
    `</h5>
            <p style="` +
    style.m0 +
    style.mb3 +
    style.textCenter +
    `margin-bottom:20px;font-weight: 600">We have recived your request to reset your password. Your verification code is ` +
    verificationCode +
    `<br>
            
            </p>
          
        </div>
       
        <div class="footer" style="` +
    style.footer +
    `">
        &copy 2023  All rights reserved.
        </div>
      </div>`;

  SmtpController.sendEmail(email, 'Reset Password', message);
};


addUserEmail = function (options) {
  var email = options.email;

  var firstName = options.firstName;
  var password = options.password;

  if (!firstName) {
    firstName = email;
  }
  message = '';
  style = {
    header: `
            padding:30px 15px;
            text-align:center;
            background-color:#f2f2f2;
            `,
    body: `
            padding:15px;
            height: 230px;
            `,
    hTitle: `font-family: 'Raleway', sans-serif;
            font-size: 37px;
            height:auto;
            line-height: normal;
            font-weight: bold;
            background:none;
            padding:0;
            color:#333;
            `,
    maindiv: `
            width:600px;
            margin:auto;
            font-family: Lato, sans-serif;
            font-size: 14px;
            color: #333;
            line-height: 24px;
            font-weight: 300;
            border: 1px solid #eaeaea;
            `,
    textPrimary: `color:#3e3a6e;
            `,
    h5: `font-family: Raleway, sans-serif;
            font-size: 22px;
            background:none;
            padding:0;
            color:#333;
            height:auto;
            font-weight: bold;
            line-height:normal;
            `,
    m0: `margin:0;`,
    mb3: 'margin-bottom:15px;',
    textCenter: `text-align:center;`,
    btn: `padding:10px 30px;
            font-weight:500;
            font-size:14px;
            line-height:normal;
            border:0;
            display:inline-block;
            text-decoration:none;
            `,
    btnPrimary: `
            background-color:#3e3a6e;
            color:#fff;
            `,
    footer: `
            padding:10px 15px;
            font-weight:500;
            color:#fff;
            text-align:center;
            background-color:#000;
            `,
  };

  message +=
    `<div class="container" style="` +
    style.maindiv +
    `">
        <div class="header" style="` +
    style.header +
    `text-align:center">
            <img src="` +
    constant.FRONT_WEB_URL +
    `assets/img/logo.png" style="margin-bottom:20px;  width=100px;" />
            <h2 style="` +
    style.hTitle +
    style.m0 +
    `">Registration</h2>
        </div>
        <div class="body" style="` +
    style.body +
    `">
            <h5 style="` +
    style.h5 +
    style.m0 +
    style.mb3 +
    style.textCenter +
    `">Hello ` +
    firstName +
    `</h5>
            <p style="` +
    style.m0 +
    style.mb3 +
    style.textCenter +
    `margin-bottom:20px;font-weight: 600">Your account is created on property <br>
            
            </p>
            <p style="` +
    style.m0 +
    style.mb3 +
    style.textCenter +
    `margin-bottom:20px;font-weight: 600">Your login credentials are: <br>
            
            </p>
  
            <p style="` +
    style.m0 +
    style.mb3 +
    style.textCenter +
    `margin-bottom:20px;font-weight: 600">Email: ${email} <br>
                
                </p>
  
                <p style="` +
    style.m0 +
    style.mb3 +
    style.textCenter +
    `margin-bottom:20px;font-weight: 600">Password: ${password} <br>
                    
                    </p>
          
        </div>
       
        <div class="footer" style="` +
    style.footer +
    `">
        &copy 2023 All rights reserved.
        </div>
      </div>`;

  SmtpController.sendEmail(email, 'Registration', message);
};

