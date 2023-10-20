const { checkJwtHS256 } = require("../../../middleware/authService");
const contactConfig=require("../../../model-config/contactConfig");
const { startTransaction } = require("../../../sequelize/transaction");
const { v4 } = require("uuid");
const { Op } = require("sequelize");

const {parseFilterQueries, parseSelectFields,parseLimitAndOffset}=require('../../../utils/request')
const {preloadAssociations}=require('../../../sequelize/association');
const ContactDetailsService = require("./ContactDetailsService ");


require('dotenv').config()
class ContactService{
    constructor(){
 this.contactDetailsService=new ContactDetailsService()
    }
    async createContact(settingsConfig,bodyElements,req,res,next){
        const t=await startTransaction()
        try {
            const logger = settingsConfig.logger;
            logger.info(`[CONTACT_SERVICE] : Inside createContact`);
            const payload=checkJwtHS256(settingsConfig, req, res, next)
            bodyElements.id=v4()
            bodyElements.userId=payload.id
            console.log(bodyElements)
            await contactConfig.model.create(bodyElements,{transaction:t})
            await t.commit()
             
            
        } 
        catch (error) {
           await t.rollback() 
           throw error
        }

    }
    async deleteContact(settingsConfig,queryParams){
        const t=await startTransaction()
        try {
            const logger = settingsConfig.logger;
            logger.info(`[CONTACT_SERVICE] : Inside deleteContact`);
           
           
          await  contactConfig.model.destroy({...parseFilterQueries(queryParams,contactConfig.filter,{[contactConfig.feildMapping.id]:queryParams.id})})
           
            t.commit()
    
        
        } 
        catch (error) {
           
           throw error
        }
    }
  
      
      async updateContact(settingsConfig,queryParams,userObj){
             
          const t=await startTransaction()
          try {
              const logger = settingsConfig.logger;
              logger.info(`[CONTACT_SERVICE] : Inside updateUser`);
             
         
              await contactConfig.model.update(userObj, {
                ...parseFilterQueries(queryParams, contactConfig.filter, {
                  [contactConfig.feildMapping.id]: queryParams.id,
                }),
              })
              
      
           t.commit()
          } 
          catch (error) {
             t.rollback()
             throw error
          }
      }
      async getAllContact(settingsConfig,queryParams,req, res, next){
        const t= await startTransaction()
        try {
            const logger = settingsConfig.logger;
            logger.info(`[Contact_Service] : Inside getAllContact`);
            // const includeQuery=queryParams.include || [];
            // let association=[]
            // if(queryParams.include){
            //   delete queryParams.include
            // }
            // if(includeQuery){
            //   association=this.createAssociation(includeQuery)
            //   console.log(association)
            // }
          
            const attributesToReturn={
                id:contactConfig.feildMapping.id,
                firstName:contactConfig.feildMapping.firstName,
                lastName:contactConfig.feildMapping.lastName,
                userId:contactConfig.feildMapping.userId,

            } 
            const payload=checkJwtHS256(settingsConfig, req, res, next)
        
            const selectArray=Object.values(attributesToReturn)
            const data =await contactConfig.model.findAndCountAll({
            transaction:t,
           
            ...parseFilterQueries(queryParams,contactConfig.filter,{[contactConfig.feildMapping.userId]:payload.id}),
            attributes:selectArray,
            ...parseLimitAndOffset(queryParams),
            // ...preloadAssociations(association)
            })
            t.commit()
          
            return await data
    
        } catch (error) {
            t.rollback()
            throw error
        }
      }
      async getContact(settingsConfig,queryParams,req, res, next){
    
        const t= await startTransaction()
        try {
            const arrtibutesToReturn={
                id:contactConfig.feildMapping.id,
                firstName:contactConfig.feildMapping.firstName,
                lastName:contactConfig.feildMapping.lastName,
                userId:contactConfig.feildMapping.userId,
            }
           
            const selectArray=Object.values(arrtibutesToReturn)
            const payload=checkJwtHS256(settingsConfig, req, res, next)
            const data =await contactConfig.model.findOne({...parseFilterQueries(queryParams,contactConfig.filter,{[contactConfig.feildMapping.id]:queryParams.id}),attributes: selectArray,
            transaction:t})
            t.commit()
             return data
              
            
        } catch (error) {
            t.rollback()
            throw error
        }
      }
      async createContactDetails(settingsConfig,bodyElements,req,res,next){
        this.contactDetailsService.createcontactDetails(settingsConfig,bodyElements,req,res,next)
      }
      async deleteContactDetails(settingsConfig,bodyElements){
        this.contactDetailsService.deleteContactDetails(settingsConfig,bodyElements)
      }
      async updateContactDetails(settingsConfig,queryParams,parameter,newValue){
        this.contactDetailsService.updateContactDetails(settingsConfig,queryParams,parameter,newValue)
      }
      async getAllContactDetails(settingsConfig,queryParams,req, res, next){
        const data=this.contactDetailsService.getAllContactDetails(settingsConfig,queryParams,req, res, next)
        return data
      }
      async getContactDetails(settingsConfig,queryParams,req, res, next){
        this.contactDetailsService.getContactDetails(settingsConfig,queryParams,req, res, next)
      }   
}
module.exports=ContactService