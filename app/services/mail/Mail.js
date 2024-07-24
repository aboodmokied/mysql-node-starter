const mailConfig = require("../../config/mailConfig");
const nodemailer=require('nodemailer');
const NotFoundError = require("../../Errors/ErrorTypes/NotFoundError");

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
            const mailObj=services[mail];
            this.#transporters[mailObj.service]=nodemailer.createTransport({
                ...mailObj
            })
             this.#transporters[mail].verify((error, success) => {
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