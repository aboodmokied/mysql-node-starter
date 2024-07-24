const mailConfig = require("../../config/mailConfig");
const nodemailer=require('nodemailer');

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
        model.prototype.sendEmail=async function(to, subject, text, html){
            const {email}=this;
            const service=email.split('@')[1]?.split('.')[0];
            const transporter=new Mail().getTransporter(service);
            if(!transporter){
                throw new Error(`Transporter Not Found for this service: ${service}`)
            }
            const info=await transporter.sendMail({
                from:transporter.options.auth.user,
                to,
                subject,
                text,
                html
            })
            return info?.messageId ? true:false;
        };
    }
}


module.exports=Mail;