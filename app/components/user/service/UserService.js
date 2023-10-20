const { v4 } = require("uuid");
const { Op, STRING } = require("sequelize");
const { startTransaction } = require("../../../sequelize/transaction");
const {
  parseFilterQueries,
  parseSelectFields,
  parseLimitAndOffset,
} = require("../../../utils/request");
const { preloadAssociations } = require("../../../sequelize/association");
const userConfig = require("../../../model-config/userConfig");
const bcrypt = require("bcrypt");
require("dotenv").config();

const {
  tokencreation,
  checkJwtHS256,
} = require("../../../middleware/authService");
const contactConfig = require("../../../model-config/contactConfig");
const { log } = require("winston");
const ContactService = require("./ContactService");
const contactDetailsConfig = require("../../../model-config/contactDetailsConfig");
class userService {
  #associatiomMap = {
    contact: {
      model: contactConfig.model,
      as: "contact",
      include: {
        model: contactDetailsConfig.model,
        as: "contactDetails",
      },
    },
  };
  constructor() {
    this.contactService = new ContactService();
  }
  createAssociation(includeQuery) {
    const association = [];
    if (Array.isArray(includeQuery)) {
      includeQuery = [includeQuery];
    }
    if (includeQuery?.includes(userConfig.association.contactFilter)) {
      association.push(this.#associatiomMap.contact);
      console.log("association>>>>", association);
      return association;
    }
  }
  async createUser(settingsConfig, bodyElements) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[USER_SERVICE] : Inside createUser`);

      bodyElements.id = v4();
      const newPassword = bcrypt.hash(bodyElements.password, 12);
      bodyElements.password = await newPassword;
      const user = await userConfig.model.findOne({
        ...parseFilterQueries(bodyElements, userConfig.filter, {
          [userConfig.fieldMapping.username]: bodyElements.username,
        }),
        transaction: t,
      });

      if (user == null) {
        const data = await userConfig.model.create(bodyElements, {
          transaction: t,
        });
        await t.commit();

        return bodyElements;
      } else {
        throw new Error("UserName Already exist");
      }
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async deleteUser(settingsConfig, queryParams) {
    console.log(queryParams.id)
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[USER_SERVICE] : Inside deleteUser`);

      userConfig.model.destroy({...parseFilterQueries(queryParams,userConfig.filter,{[userConfig.fieldMapping.id]:queryParams.id})})
    } catch (error) {
      throw error;
    }
  }
  // async #updateFirstName(settingsConfig, queryParams, newValue, t) {
  //   try {
  //     const logger = settingsConfig.logger;
  //     logger.info(`[USER_SERVICE] : Inside updatefisrtName`);
  //     await userConfig.model.update({[userConfig.fieldMapping.firstName]:newValue},{...parseFilterQueries(queryParams,userConfig.filter,{[userConfig.fieldMapping.id]:queryParams.id})})
  //     t.commit()
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  // async #updatelastName(settingsConfig, queryParams, newValue, t) {
  //   try {
  //     const logger = settingsConfig.logger;
  //     logger.info(`[USER_SERVICE] : Inside updateUserlastName`);
  //     await userConfig.model.update({[userConfig.fieldMapping.lastName]:newValue},{...parseFilterQueries(queryParams,userConfig.filter,{[userConfig.fieldMapping.id]:queryParams.id})})
  //     t.commit()
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  // async #updateusername(settingsConfig, queryParams, newValue, t) {
  //   try {
  //     const logger = settingsConfig.logger;
  //     logger.info(`[USER_SERVICE] : Inside updateUserusername`);
  //     await userConfig.model.update({[userConfig.fieldMapping.username]:newValue},{...parseFilterQueries(queryParams,userConfig.filter,{[userConfig.fieldMapping.id]:queryParams.id})})
  //     t.commit()
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  // async #updatepassword(settingsConfig, queryParams, newnValue, t) {
  //   try {
  //     const logger = settingsConfig.logger;
  //     logger.info(`[USER_SERVICE] : Inside updateUserpassword`);
  //     const newPassword = bcrypt.hash(newnValue, 12);
  //     await userConfig.model.update(
  //       { [userConfig.fieldMapping.password]: await newPassword },
  //       { ...parseFilterQueries(queryParams, userConfig.filter) },
  //       t
  //     );
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  async updateUser(settingsConfig, queryParams, userObj) {
  
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[USER_SERVICE] : Inside updateUser`);
   
      await userConfig.model.update(userObj, {
        ...parseFilterQueries(queryParams, userConfig.filter, {
          [userConfig.fieldMapping.id]: queryParams.id,
        }),
      });
      // switch (parameter) {
      //   case "firstName": {
      //     this.#updateFirstName(settingsConfig, queryParams, newValue, t);
      //     return;
      //   }
      //   case "lastName": {
      //     this.#updatelastName(settingsConfig, queryParams, newValue, t);
      //     return;
      //   }
      //   case "password": {
      //     this.#updatepassword(settingsConfig, queryParams, newValue, t);
      //     return;
      //   }
      //   case "username": {
      //     this.#updateusername(settingsConfig, queryParams, newValue, t);
      //     return;
      //   }
      //   default: {
      //     throw new Error("Invalid Selected Feild");
      //   }
      // }
      t.commit();
    } catch (error) {
      throw error;
    }
  }

  async getAllUser(settingsConfig, queryParams) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[UserService] : Inside getAllUsers`);
      const includeQuery = queryParams.include || [];
      let association = [];
      if (queryParams.include) {
        delete queryParams.include;
      }
      if (includeQuery) {
        association = this.createAssociation(includeQuery);
        console.log("UserService", association);
      }

      const attributesToReturn = {
        id: userConfig.fieldMapping.id,
        firstName: userConfig.fieldMapping.firstName,
        lastName: userConfig.fieldMapping.lastName,
        username: userConfig.fieldMapping.username,
        isAdmin: userConfig.fieldMapping.isAdmin,
      };
      const selectArray = Object.values(attributesToReturn);
      const data = await userConfig.model.findAndCountAll({
        transaction: t,
        ...parseFilterQueries(queryParams, userConfig.filter),
        attributes: selectArray,
        ...parseLimitAndOffset(queryParams),
        ...preloadAssociations(association),
      });
      t.commit();

      return await data;
    } catch (error) {
      t.rollback();
      throw error;
    }
  }
  async getUser(settingsConfig, queryParams) {
    const t = await startTransaction();
    try {
      const arrtibutesToReturn = {
        id: userConfig.fieldMapping.id,
        firstName: userConfig.fieldMapping.firstName,
        lastName: userConfig.fieldMapping.lastName,
        username: userConfig.fieldMapping.username,
        isAdmin: userConfig.fieldMapping.isAdmin,
      };

      const selectArray = Object.values(arrtibutesToReturn);

      const data = await userConfig.model.findOne({
        ...parseFilterQueries(queryParams, userConfig.filter, {
          [userConfig.fieldMapping.id]: queryParams.id,
        }),
        attributes: selectArray,
        transaction: t,
      });
      t.commit();
      return data;
    } catch (error) {
      t.rollback();
      throw error;
    }
  }
  async login(settingsConfig, bodyElements) {
    const t = await startTransaction();
    try {
      const { username, password } = bodyElements;
      console.log(password)
      const arrtibutesToReturn = {
        password: userConfig.fieldMapping.password,
        id: userConfig.fieldMapping.id,
        firstName: userConfig.fieldMapping.firstName,
        lastName: userConfig.fieldMapping.lastName,
        username: userConfig.fieldMapping.username,
        isAdmin: userConfig.fieldMapping.isAdmin,
      };
      const arrtibutesToReturnIncludedInTokenCreation = {
        id: userConfig.fieldMapping.id,
        firstName: userConfig.fieldMapping.firstName,
        lastName: userConfig.fieldMapping.lastName,
        username: userConfig.fieldMapping.username,
        isAdmin: userConfig.fieldMapping.isAdmin,
      };

      const selectArray = Object.values(arrtibutesToReturn);
      const selectArrayIncludedInTokenCreation = Object.values(
        arrtibutesToReturnIncludedInTokenCreation
      );
      const passwordObj = await userConfig.model.findOne({
        ...parseFilterQueries(bodyElements, userConfig.filter, {
          [userConfig.fieldMapping.username]: username,
        }),
        attributes: selectArray,
        transaction: t,
      });
      const result = bcrypt.compare(password, await passwordObj.password);

      if (!(await result)) {
        throw new Error("Invalid Password");
      }
      if (await result) {
        const payload = {
          id: passwordObj.id,
          username: passwordObj.username,
          isAdmin: passwordObj.isAdmin,
        };

        const token = tokencreation(payload);
        t.commit()
        return [token, passwordObj];
      }
    } catch (error) {
      throw error;
    }
  }
  async reset(settingsConfig, username, newPassword,oldPassword,queryParams) {
    const t = await startTransaction();
    try { 
      
      const logger = settingsConfig.logger;
       logger.info(`[UserService] : Inside resetPassword`);
      //  const passwordObj = await userConfig.model.findOne({
      //   ...parseFilterQueries(bodyElements, userConfig.filter, {
      //     [userConfig.fieldMapping.username]: username,
      //   }),
      //   attributes: selectArray,
      //   transaction: t,
      // });
     
      let hashedPassword = await bcrypt.hash(newPassword, 12);

      await userConfig.model.update({ password: hashedPassword },{ where: { username: username }, transaction: t });
      // await userConfig.model.update({...parseFilterQueries(queryParams,userConfig.filter,{[userConfig.fieldMapping.id]:queryParams.userId})})
      await t.commit();        
      return [1]
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
  
  async createContact(settingsConfig, bodyElements, req, res, next) {
    this.contactService.createContact(
      settingsConfig,
      bodyElements,
      req,
      res,
      next
    );
  }
  async deleteContact(settingsConfig, bodyElements) {
    this.contactService.deleteContact(settingsConfig, bodyElements);
  }
  async updateContact(settingsConfig, queryParams, userObj) {
    this.contactService.updateContact(

      settingsConfig,
      queryParams,
      userObj
    );
  }
  async getAllContact(settingsConfig, queryParams, req, res, next) {
    this.contactService.getAllContact(
      settingsConfig,
      queryParams,
      req,
      res,
      next
    );
  }
  async getContact(settingsConfig, queryParams, req, res, next) {
    this.contactService.getContact(settingsConfig, queryParams, req, res, next);
  }
  async createContactDetails(settingsConfig, bodyElements, req, res, next) {
    this.contactService.createContactDetails(
      settingsConfig,
      bodyElements,
      req,
      res,
      next
    );
  }
  async deleteContactDetails(settingsConfig, bodyElements) {
    this.contactService.deleteContactDetails(settingsConfig, bodyElements);
  }
  async updateContactDetails(settingsConfig, queryParams, parameter, newValue) {
    this.contactService.updateContactDetails(
      settingsConfig,
      queryParams,
      parameter,
      newValue
    );
  }
  async getAllContactDetails(settingsConfig, queryParams, req, res, next) {
   const data= this.contactService.getAllContactDetails(
      settingsConfig,
      queryParams,
      req,
      res,
      next
    );
    return data
  }
  async getContactDetails(settingsConfig, queryParams, req, res, next) {
    this.contactService.getContactDetails(
      settingsConfig,
      queryParams,
      req,
      res,
      next
    );
  }
  async verifyUserByUsername(settingsConfig, payload, username) {
    return payload.username === username;
  }
}
const newService = new userService();
module.exports = newService;
