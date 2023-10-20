const { validateUuid } = require("../utils/uuid");

const db = require("../../models");
const { validateStringLength } = require("../utils/string");
const { Op } = require("sequelize");
class ContactDetailsConfig {
  constructor() {
    this.feildMapping = Object.freeze({
      id: "id",
      type: "type",
      contactNumber: "contactNumber",
      contactId: "contactId",
    });

    (this.model = db.contactDetails),
      (this.modelName = db.contactDetails.name),
      (this.tableName = db.contactDetails.tableName);
    this.filter = Object.freeze({
      id: (id) => {
        validateUuid(id);
        return {
          [this.feildMapping.id]: {
            [Op.eq]: id,
          },
        };
      },
      type: (type) => {
        return {
          [this.feildMapping.type]: {
            [Op.like]: `%${type}%`,
          },
        };
      },
      contactNumber: (contactNumber) => {
        validateStringLength(contactNumber, 10);

        return {//this.fieldMapping.contactNumber
          [this.feildMapping.contactNumber]: {
            [Op.like]: `%${contactNumber}%`,
          },
        };
      },
      contactId: (contactId) => {
        validateUuid(contactId);

        return {
          [this.feildMapping.contactId]: {
            [Op.eq]: contactId,
          },
        };
      },
    });
  }
}
const contactDetailsConfig = new ContactDetailsConfig();
module.exports = contactDetailsConfig;
