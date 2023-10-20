const { checkJwtHS256 } = require("../../../middleware/authService");
const userConfig = require("../../../model-config/userConfig");
const newService = require("../service/UserService");
require("dotenv").config();

class UserController {
  constructor() {
    this.userService = newService;
  }
  async createUser(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[USER_CONTROLLER] : Inside createUser`);
      const bodyElement = req.body;
      userConfig.validateUser(bodyElement);

      const data = await this.userService.createUser(
        settingsConfig,
        bodyElement
      );

      return res.status(200).json(await data);
    } catch (error) {
      next(error);
    }
  }
  async deleteUser(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[USER_CONTROLLER] : Inside createUser`);
      const { id } = req.query;

      this.userService.deleteUser(settingsConfig, req.query);
      return res.status(200).json("UserDeleted Successfully");
    } catch (error) {
      next(error);
    }
  }
  async updateUser(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[USER_CONTROLLER] : Inside updateUser`);
      // const { parameter, newValue } = req.body;

      const queryParams = req.params;
      const userObj = req.body;
      this.userService.updateUser(settingsConfig, queryParams, userObj);
      return res.status(200).json("UserUpdated Successfully");
    } catch (error) {
      next(error);
    }
  }
  async getAllUser(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[USER_CONTROLLER] : Inside getAllUser`);
      const queryParams = req.query;
      const { rows, count } = await this.userService.getAllUser(
        settingsConfig,
        queryParams
      );
      res.set("X-Total-Count", count);
      return res.status(200).json(rows);
    } catch (error) {
      next(error);
    }
  }

  async getUser(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[USER_CONTROLLER] : Inside getUser`);
      const queryParams = req.query;

      const data = await this.userService.getUser(settingsConfig, queryParams);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  async verifyUserByUsername(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[USER_CONTROLLER] : Inside Lock`);
      const { username } = req.body;
      //validation
      if (!username) {
        return res.status(200).json({ result: false });
      }
      const payload = checkJwtHS256(settingsConfig, req, res, next);
      if (!payload) {
        return res.status(200).json({ result: false });
      }
      const response = await this.userService.verifyUserByUsername(
        settingsConfig,
        payload,
        username
      );
      return res.status(200).json({ result: response });
    } catch (error) {
      return res.status(200).json({ result: false });
    }
  }
  async reset(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[USER_CONTROLLER] : Inside login`);
      const {username,newPassword,oldPassword}= req.body;
      const queryParams=req.params
      const payload=checkJwtHS256(settingsConfig,req,res,next)
      if(payload.username!=username){
        throw new Error("Invalid Username")
      }
      const data = await this.userService.reset(
        settingsConfig,
        username,newPassword,oldPassword,
        queryParams
      );
 
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  async login(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[USER_CONTROLLER] : Inside login`);
      const bodyElement = req.body;
     
      const [token, passwordObj] = await this.userService.login(
        settingsConfig,
        bodyElement
      );
      console.log(process.env.AUTH_CLIENT_NAME, token);
      res.set(process.env.AUTH_CLIENT_NAME, token);
      res.cookie(process.env.AUTH_CLIENT_NAME, token);
      return res.status(200).json(passwordObj);
    } catch (error) {
      next(error);
    }
  }
  async logout(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[USER_CONTROLLER] : Inside login`);

      res.cookie(process.env.AUTH_CLIENT_NAME, "", {
        expires: new Date(Date.now()),
      });

      return res.status(200).json("Logout Succesful");
    } catch (error) {
      next(error);
    }
  }
  async createContact(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[USER_CONTROLLER] : Inside createContact`);
      const bodyElement = req.body;

      const data = await this.userService.createContact(
        settingsConfig,
        bodyElement,
        req,
        res,
        next
      );
      return res.status(200).json(await data);
    } catch (error) {
      next(error);
    }
  }
  async deleteContact(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[USER_CONTROLLER] : Inside delete Contact`);
      const { id } = req.query;

      this.userService.contactService.deleteContact(settingsConfig, req.query);
      return res.status(200).json("Contact Deleted Successfully");
    } catch (error) {
      next(error);
    }
  }
  async updateContact(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[CONTACT_CONTROLLER] : Inside update Contact`);

      const queryParams = req.params;
      console.log(queryParams, req.body);
      this.userService.updateContact(settingsConfig, queryParams, req.body);
      return res.status(200).json("Contact Updated Successfully");
    } catch (error) {
      next(error);
    }
  }
  async getAllContact(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[CONTACT_CONTROLLER] : Inside getAllContact`);
      const queryParams = req.query;
      console.log("hello");
      const { rows, count } =
        await this.userService.contactService.getAllContact(
          settingsConfig,
          queryParams,
          req,
          res,
          next
        );
      res.set("X-Total-Count", count);
      return res.status(200).json(await rows);
    } catch (error) {
      next(error);
    }
  }

  async getContact(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[USER_CONTROLLER] : Inside getContact`);
      const queryParams = req.query;

      const data = await this.userService.contactService.getContact(
        settingsConfig,
        queryParams,
        req,
        res,
        next
      );
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  async createContactDetails(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[USER_CONTROLLER] : Inside createContactDetails`);
      const bodyElement = req.body;
      const {contactId}=req.params
      const data =
        await this.userService.contactService.contactDetailsService.createcontactDetails(
          settingsConfig,
          bodyElement,
          contactId,
          req,
          res,
          next

        );
      return res.status(200).json(await data);
    } catch (error) {
      next(error);
    }
  }
  async deleteContactDetails(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[USER_CONTROLLER] : Inside delete Contact Details`);

      this.userService.deleteContactDetails(settingsConfig, req.query);
      return res.status(200).json("Contact Details Deleted Successfully");
    } catch (error) {
      next(error);
    }
  }
  async updateContactDetails(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[CONTACTDetails_CONTROLLER] : Inside update ContactDetails`);

      const queryParams = req.params;
      this.userService.updateContactDetails(
        settingsConfig,
        queryParams,
        req.body
      );
      return res.status(200).json("Contact Details Updated Successfully");
    } catch (error) {
      next(error);
    }
  }
  async getAllContactDetails(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[USER_CONTROLLER] : Inside getAllContactDetails`);
      const queryParams = req.query;
      queryParams.contactId = req.params["contactId"];
      console.log(queryParams, ">>>>>>>>>>>>>>>>>>>>>>>>>>>");
      const { rows, count } = await this.userService.getAllContactDetails(
        settingsConfig,
        queryParams,
        req,
        res,
        next
      );
      res.set("X-Total-Count", count);
      return res.status(200).json(rows);
    } catch (error) {
      next(error);
    }
  }

  async getContactDetails(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[USER_CONTROLLER] : Inside getContactDetails`);
      const queryParams = req.query;

      const data = await this.userService.getContactDetails(
        settingsConfig,
        queryParams,
        req,
        res,
        next
      );
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new UserController();
