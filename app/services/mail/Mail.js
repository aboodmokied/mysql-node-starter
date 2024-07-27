const mailConfig = require("../../config/mailConfig");
const nodemailer=require('nodemailer');
const NotFoundError = require("../../Errors/ErrorTypes/NotFoundError");
const VerifyEmailToken = require("../../models/verifyEmailToken");
const crypto=require('crypto');

class Mail{
    #transporters={};

    constructor(){
        return Mail.instance??=this;
    }
    getTransporter(service){
        return this.#transporters[service];
    }
    setup(){
        this.#createTransporters();
    }    

    #createTransporters(){
        const {mails}=mailConfig;
        for(let mail in mails){
            const mailObj=mails[mail];
            this.#transporters[mailObj.service]=nodemailer.createTransport({
                ...mailObj
            })
             this.#transporters[mailObj.service].verify((error, success) => {
                if (error) {
                    console.log(error);
                    throw new Error(`Error configuring transporter: ${mail}`);
                }   
            });
        }
    }

    applyMailing(model){
        // object level
        model.prototype.sendEmail=async function({ subject, text, html}){
            const {email}=this;
            const service=email.split('@')[1]?.split('.')[0];
            const transporter=new Mail().getTransporter(service);
            if(!transporter){
                throw new Error(`Transporter Not Found for this service: ${service}`)
            }
            const info=await transporter.sendMail({
                from:transporter.options.auth.user,
                to:email,
                subject,
                text,
                html
            })
            return info?.messageId ? true:false;
        };
        model.prototype.verifyEmail=async function(){
            const {email,guard}=this;
            const count=await VerifyEmailToken.count({where:{email,guard,revoked:false}});
            if(count){
                return {wasSent:false,message:'Verification message already sent, check your email.'}
            }
            const service=email.split('@')[1]?.split('.')[0];
            const transporter=new Mail().getTransporter(service);
            if(!transporter){
                throw new Error(`Transporter Not Found for this service: ${service}`)
            }
            const token=crypto.randomBytes(32).toString('hex');
            const hashedToken=crypto.createHash('sha256').update(token).digest('hex');
            const url=`${process.env.APP_URL}:${process.env.PORT||3000}/auth/verify-email/${hashedToken}?email=${email}`
            await VerifyEmailToken.update({revoked:true},{where:{email,guard}})            
            const verifyEmailToken=await VerifyEmailToken.create({
                email,
                guard,
                token:hashedToken,
            });
            const info=await transporter.sendMail({
                from:transporter.options.auth.user,
                to:email,
                subject: 'Email Verification',
                html: `<p>Hello ${this.name},</p>
                    <p>Thank you for registering. Please click the link below to verify your email address:</p>
                    <p>${url}</p>`
            })
            if(!info){
                throw new Error('Something went wrong when sending email');
            }
            return {wasSent:true,message:'Verifivation message was sent, check your email'};
        };
        // class level
        model.sendEmail=async function(userId,{subject, text, html}){
            const user=await model.findByPk(userId);
            if(!user){
                throw new NotFoundError(`user with id {${userId}} not found`);
            }
            const {email}=user;
            const service=email.split('@')[1]?.split('.')[0];
            const transporter=new Mail().getTransporter(service);
            if(!transporter){
                throw new Error(`Transporter Not Found for this service: ${service}`)
            }
            const info=await transporter.sendMail({
                from:transporter.options.auth.user,
                to:email,
                subject,
                text,
                html
            })
            return info?.messageId ? true:false;
        };
    }
}


module.exports=Mail;