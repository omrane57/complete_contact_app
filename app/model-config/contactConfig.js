const {validateUuid}=require('../utils/uuid')

const db = require("../../models")
const { validateStringLength } = require('../utils/string')
const { Op } = require('sequelize')
class ContactConfig{
    constructor(){
        this.feildMapping=Object.freeze({
            id:"id",
            firstName:"firstName",
            lastName:"lastName",
            userId:"userId"
        })
     
        this.model=db.contact,
        this.modelName=db.contact.name,
        this.tableName=db.contact.tableName
        this.filter=Object.freeze({
            id: (id) => {
            
               
                return {
                  [this.feildMapping.id]: {
                    [Op.eq]: id,
                  },
                };
              },
            firstName: (firstName) => {
        
            
            return {
                [this.feildMapping.firstName]: {
                [Op.like]: `%${firstName}%`,
                },
            };
            },
            lastName: (lastName) => {
        
            
                return {
                    [this.feildMapping.lastName]: {
                    [Op.like]: `%${lastName}%`,
                    },
                };
                },
            userId: (userId) => {
                validateUuid(userId)
        
                return {
                    [this.fieldMapping.userId]: {
                    [Op.eq]: userId,
                    },
                };
                }      
        })
    }
}
const contactConfig=new ContactConfig()
module.exports=contactConfig