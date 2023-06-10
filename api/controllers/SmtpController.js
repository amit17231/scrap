/**
 * SmtpController
 *
 * @description :: Server-side logic for managing Smtp
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var nodemailer = require('nodemailer');
 var smtpTransport = require('nodemailer-smtp-transport');


 module.exports = {

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @description Used to get smtp detail
 * @createdAt 02/Dec/2022
 */
smtp : (req,res)=>{    
    Smtp.find({}).then(smtp=>{
        if(smtp.length >0){
            return res.status(200).json({
                "success": true,
                "code":200,
                "data":smtp[0],
            })
        }else{
            return res.status(200).json({
                "success": true,
                "code":200,
                "data":{},
            })
        }        
    });
},
/**
 * 
 * @param {*} req {id:""}
 * @param {*} res 
 * @description Used to update the smtp details
 * @createdAt 02/Dec/2022
 * @returns {success:"",code:"",data:""}
 */
edit : (req,res)=>{
    var id = req.param('id')  
  
    data = req.body
    Smtp.updateOne({id:id},data).then(updatedSmtp=>{
        return res.status(200).json({
            "success": true,
            "code":200,
            "data":updatedSmtp,
            "message":"SMTP updated successfully."
    
        })
    })

   
   
},
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
testSMTP : (req, res)=>{
    data = req.body
    Smtp.find({}).then(smtp=>{ 
    transport = nodemailer.createTransport(smtpTransport({
        host: smtp[0].host,
                port: smtp[0].port,
                debug: true,
                sendmail: true,
                requiresAuth: true,
                auth: {
                    user: smtp[0].user, 
                    pass: smtp[0].pass
                },
                tls: {
                    rejectUnauthorized: false
                }
    }));

    var myVar;

 
    myVar = setTimeout(() => {
        console.log("sending res")
        return res.status(400).json({
            success:false,
            "error": {"code": 400, "message" : "SMTP credentials are not valid."}
        })
    
    }, 10000);
  
     var html = `<!DOCTYPE html>
     <html>
     <head>
     
     </head>
     <body>
         <div>
             <div style=" width: 600px;
             margin: auto;
             padding: 15px;
             box-shadow: -1px 2px 1px 3px #f0f0f0;
             border-radius: 50px;">
     <div>
         <a href="https://sellercentral.amazon.in/gspn/searchpage/Manufacturing?ref_=sc_gspn_hp_mlst&sellFrom=IN&sellIn=IN&localeSelection=en_US">
             <img src="https://property-frontend-seven.vercel.app/assets/img/dummy.jpeg" alt="" style=" width: 100%; 
             border-radius: 21px;">
     
         </a>
     
         
     
        
     </div>
     
     <p style="    font-size: 16px;
     font-family: sans-serif;
     color: #313131; 
         margin-top: 20px;">Say goodbye to unassessed manufacturers! Amazon SPN connects
          you with manufacturers assessed by globally reputed independent audit
           agencies. View their audit reports, find the right fit, and take control
            of your sourcing. Amazon SPN is free and easy to use. Discover verified <a href="https://sellercentral.amazon.in/gspn/searchpage/Manufacturing?ref_=sc_gspn_hp_mlst&sellFrom=IN&sellIn=IN&localeSelection=en_US">manufacturers now!</a> </p>
     
     
     <div style="    display: flex;
     justify-content: center;">
         <a href="https://sellercentral.amazon.in/gspn/searchpage/Manufacturing?ref_=sc_gspn_hp_mlst&sellFrom=IN&sellIn=IN&localeSelection=en_US">
             <button style="background-color: #f6b800;
             border: 0px;
             padding: 11px 51px;
             border-radius: 50px;
             font-size: 19px;
             font-weight: 600;
             color: black;">Visit SPN Now</button>
           </a>
     </div>
     
             </div>
         </div>
     </body>
     </html>`   
   
    transport.sendMail({
        from: 'Amit Kumar  <' + data.user + '>',
        to: "manish.rana@valueforsellers.com",
        subject: "SMTP TESTING",
        html: html
    }, function (err, info) {
       
        
        clearTimeout(myVar);
        
        if(err){
            return res.status(400).json({
                success:false,
                "error": {"code": 400, "message" : ""+err}
            })
        }else{
            return res.status(200).json({
                "success": true,
                "code":200,               
                "message":"SMTP working successfully."
        
            })
            
        }
        
    });
})
},

sendEmail: ((to, subject, message, next)=>{

    Smtp.find({}).then(smtp=>{        
        if(smtp.length >0){
            transport = nodemailer.createTransport(smtpTransport({
                host: smtp[0].host,
                port: smtp[0].port,
                debug: true,
                sendmail: true,
                requiresAuth: true,
                auth: {
                    user: smtp[0].user, 
                    pass: smtp[0].pass
                },
                tls: {
                    rejectUnauthorized: false
                }
            }));
            transport.sendMail({
                from: 'Amit Kumar  <' + smtp[0].user + '>',
                to: to,
                subject: subject,
                html: message
            }, function (err, info) {
                console.log('err', err, info)
                
            });

            
        }
    });

})
  


};
