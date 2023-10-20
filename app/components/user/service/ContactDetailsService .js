const { checkJwtHS256 } = require("../../../middleware/authService");
const contactDetailsConfig = require("../../../model-config/contactDetailsConfig");
const { startTransaction } = require("../../../sequelize/transaction");
const { v4 } = require("uuid");
const { Op } = require("sequelize");

const {
  parseFilterQueries,
  parseSelectFields,
  parseLimitAndOffset,
} = require("../../../utils/request");
const { preloadAssociations } = require("../../../sequelize/association");

require("dotenv").config();
class ContactDetailsService {
  constructor() {}
  async createcontactDetails(settingsConfig, bodyElements,contactId ,req, res, next) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[CONTACTDetails_SERVICE] : Inside createContactDetails`);
      const payload = checkJwtHS256(settingsConfig, req, res, next);

      bodyElements.id = v4();
      console.log(bodyElements);

      contactDetailsConfig.model.create(bodyElements);
      t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
  async deleteContactDetails(settingsConfig, queryParams) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[CONTACTDetails_SERVICE] : Inside deleteContactDetails`);

      await contactDetailsConfig.model.destroy(
        { ...parseFilterQueries(queryParams, contactDetailsConfig.filter) },
        t
      );
    } catch (error) {
      throw error;
    }
  }
  async #updatetype(settingsConfig, queryParams, newnValue, t) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[CONTACTDetails_SERVICE] : Inside update firstNDetailsame`);
      await contactDetailsConfig.model.update(
        { [contactDetailsConfig.feildMapping.type]: newnValue },
        { ...parseFilterQueries(queryParams, contactDetailsConfig.filter) },
        t
      );
    } catch (error) {
      throw error;
    }
  }
  async #updatecontactNumber(settingsConfig, queryParams, newnValue, t) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[CONTACTDetails_SERVICE] : Inside updatelastNamDetailse`);
      await contactDetailsConfig.model.update(
        { [contactDetailsConfig.feildMapping.contactNumber]: newnValue },
        { ...parseFilterQueries(queryParams, contactDetailsConfig.filter) },
        t
      );
    } catch (error) {
      throw error;
    }
  }

  async updateContactDetails(
    settingsConfig,
    queryParams,
    contactDetailsObject
  ) {
    const t = await startTransaction();
    try {
      await contactDetailsConfig.model.update(contactDetailsObject, {
        ...parseFilterQueries(queryParams, contactDetailsConfig.filter, {
          [contactDetailsConfig.feildMapping.id]: queryParams.contactDetailsId,
        }),
      });
    } catch (error) {
      throw error;
    }
  }
  async getAllContactDetails(settingsConfig, queryParams, req, res, next) {
    const t = await startTransaction();

    try {
      const logger = settingsConfig.logger;
      logger.info(`[ContactDetails_Service] : Inside getAllContactDetails`);
      // const includeQuery=queryParams.include || [];
      // let association=[]
      // if(queryParams.include){
      //   delete queryParams.include
      // }
      // if(includeQuery){
      //   association=this.createAssociation(includeQuery)
      //   console.log(association)
      // }

      const attributesToReturn = {
        id: contactDetailsConfig.feildMapping.id,
        type: contactDetailsConfig.feildMapping.type,
        contactNumber: contactDetailsConfig.feildMapping.contactNumber,
        contactId: contactDetailsConfig.feildMapping.contactId,
      };
      // const payload=checkJwtHS256(settingsConfig, req, res, next)
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", queryParams);
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", queryParams);
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", queryParams);
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", queryParams);
      const selectArray = Object.values(attributesToReturn);
      const data = await contactDetailsConfig.model.findAndCountAll({
        transaction: t,
        ...parseFilterQueries(queryParams, contactDetailsConfig.filter, {
          [contactDetailsConfig.feildMapping.contactId]: queryParams.contactId,
        }),
        attributes: selectArray,
        ...parseLimitAndOffset(queryParams),
        // ...preloadAssociations(association)
      });

      t.commit();

      return await data;
    } catch (error) {
      t.rollback();
      throw error;
    }
  }
  async getContactDetails(settingsConfig, queryParams, req, res, next) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[ContactDetails_Service] : Inside getContactDetails`);

      const arrtibutesToReturn = {
        id: contactDetailsConfig.feildMapping.id,
        type: contactDetailsConfig.feildMapping.type,
        contactNumber: contactDetailsConfig.feildMapping.contactNumber,
        contactId: contactDetailsConfig.feildMapping.contactId,
      };

      const selectArray = Object.values(arrtibutesToReturn);
      const payload = checkJwtHS256(settingsConfig, req, res, next);
      const data = await contactDetailsConfig.model.findOne({
        ...parseFilterQueries(queryParams, contactDetailsConfig.filter, {
          [contactDetailsConfig.feildMapping.id]: queryParams.id,
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
}
module.exports = ContactDetailsService;
