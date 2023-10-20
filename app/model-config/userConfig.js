const {validateUuid}=require('../utils/uuid')

const db = require("../../models")
const { validateStringLength } = require('../utils/string')
const { Op } = require('sequelize')

class UserConfig{
    constructor(){
        this.fieldMapping=Object.freeze({
            id:"id",
            firstName:"firstName",
            lastName:"lastName",
            username:"username",
            password:"password",
            isAdmin:"isAdmin"
        })
        this.association=Object.freeze({
          contactFilter:'contactFilter',
      })  
      this.model=db.user
      this.modelName=db.user.name
      this.tableName=db.user.tableName
      this.filter=Object.freeze({
        id: (id) => {
            
            validateUuid(id)
            return {
              [this.fieldMapping.id]: {
                [Op.eq]: id,
              },
            };
          },
        firstName: (firstName) => {
            
            return {
              [this.fieldMapping.firstName]: {
                [Op.like]: `%${firstName}%`,
              },
            };
          },
          lastName: (lastName) => {
            return {
              [this.fieldMapping.lastName]: {
                [Op.like]: `%${lastName}%`,
              },
            };
          },
          username: (username) => {
         
            return {
             
              [this.fieldMapping.username]: {
                [Op.like]: `%${username}%`,
              },
            };
          },
          isAdmin: (isAdmin) => {
            return {
              [this.fieldMapping.isAdmin]: {
                [Op.eq]: isAdmin,
              },
            };
          },
      })
    }
    validateUser(user){
        try {
            const{firstName,lastName,username,password,isAdmin}=user
            if(typeof firstName!="string"||typeof lastName!="string"||typeof username!="string"||typeof password!="string"||typeof isAdmin!="boolean")
    
 {
      throw new Error("Invalid Parameter")
 }           
        } catch (error) {
            throw error
        }
    
      }
   validateUsername(username){
    try{
     if(typeof username!="string"){
      throw new Error("Invalid Username")
     }
    }
    catch(error){
     throw error
    }
   }
}
const userConfig=new UserConfig()
module.exports=userConfig