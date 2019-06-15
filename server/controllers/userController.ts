import UserRepository from "../repositories/userRepository";
import * as httpStatus from "http-status";
import * as bcrypt from "bcrypt";
import { generateHash } from "random-hash";
import * as jwt from "jsonwebtoken";
import Config from "../config/configs";

const sendReponse = function(res, statusCode, data) {
  res.status(statusCode).json(data);
};

class UserController {
  constructor() {}

  get(req, res) {
    try {
      UserRepository.getAll(req.headers["x-access-content"])
        .then(userList => {
          if (userList.length > 0) {
            sendReponse(res, httpStatus.OK, {
              status: "success",
              message: "User list found!!!",
              data: { users: userList }
            });
          } else {
            sendReponse(res, httpStatus.OK, {
              status: "success",
              message: "Empty user list!!!",
              data: null
            });
          }
        })
        .catch(err => {
          sendReponse(res, httpStatus.INTERNAL_SERVER_ERROR, err);
          console.error.bind(console, `Error ${err}`);
        });
    } catch (error) {
      sendReponse(res, httpStatus.INTERNAL_SERVER_ERROR, error);
      console.error.bind(console, `Error ${error}`);
    }
  }

  getById(req, res) {
    try {
      const _id = { id: req.params.id };

      if (!_id) {
        sendReponse(res, httpStatus.OK, "user not found!");
      } else {
        UserRepository.getById(req.params.id, req.headers["x-access-content"])
          .then(userInfo => {
            if (userInfo.length > 0) {
              sendReponse(res, httpStatus.OK, {
                status: "success",
                message: "User found!!!",
                data: { user: userInfo }
              });
            } else {
              sendReponse(res, httpStatus.OK, {
                status: "success",
                message: "User not found!!!",
                data: null
              });
            }
          })
          .catch(err => {
            sendReponse(res, httpStatus.INTERNAL_SERVER_ERROR, err);
            console.error.bind(console, `Error ${err}`);
          });
      }
    } catch (error) {
      sendReponse(res, httpStatus.INTERNAL_SERVER_ERROR, error);
      console.error.bind(console, `Error ${error}`);
    }
  }

  authenticate(req, res) {
    try {
      UserRepository.findOne(req.body.email)
        .then(userInfo => {
          if (!userInfo) {
            sendReponse(res, httpStatus.FORBIDDEN, {
              status: "error",
              message: "Invalid email/password!!!",
              data: null
            });
          } else if (bcrypt.compareSync(req.body.password, userInfo.password)) {
            const token = jwt.sign(
              { id: userInfo._id, contentAccessKey: userInfo.contentAccessKey },
              Config.secret,
              { expiresIn: "1h" }
            );
            sendReponse(res, httpStatus.OK, {
              status: "success",
              message: "user Autenticated!!!",
              data: { user: userInfo, token: token }
            });
          } else {
            sendReponse(res, httpStatus.FORBIDDEN, {
              status: "error",
              message: "Invalid email/password!!!",
              data: null
            });
          }
        })
        .catch(err => {
          sendReponse(res, httpStatus.INTERNAL_SERVER_ERROR, err);
          console.error.bind(console, `Error ${err}`);
        });
    } catch (error) {
      sendReponse(res, httpStatus.INTERNAL_SERVER_ERROR, error);
      console.error.bind(console, `Error ${error}`);
    }
  }

  register(req, res) {
    try {
      UserRepository.register({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        contentAccessKey: generateHash({ length: 60 }),
        admin: true
      })
        .then(userInfo => {
          const token = jwt.sign(
            { id: userInfo._id, contentAccessKey: userInfo.contentAccessKey },
            Config.secret,
            { expiresIn: "1h" }
          );
          sendReponse(res, httpStatus.OK, {
            status: "success",
            message: "User registred successfully!!!",
            data: { user: userInfo, token: token }
          });
        })
        .catch(err => {
          sendReponse(res, httpStatus.INTERNAL_SERVER_ERROR, err);
          console.error.bind(console, `Error ${err}`);
        });
    } catch (error) {
      sendReponse(res, httpStatus.INTERNAL_SERVER_ERROR, error);
      console.error.bind(console, `Error ${error}`);
    }
  }

  create(req, res) {
    try {
      UserRepository.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        contentAccessKey: req.headers["x-access-content"],
        admin: req.body.admin
      })
        .then(userInfo => {
          sendReponse(res, httpStatus.OK, {
            status: "success",
            message: "User added successfully!!!",
            data: { user: userInfo }
          });
        })
        .catch(err => {
          sendReponse(res, httpStatus.INTERNAL_SERVER_ERROR, err);
          console.error.bind(console, `Error ${err}`);
        });
    } catch (error) {
      sendReponse(res, httpStatus.INTERNAL_SERVER_ERROR, error);
      console.error.bind(console, `Error ${error}`);
    }
  }

  update(req, res) {
    try {
      if (req.body.length == 0) {
        return sendReponse(res, httpStatus.NOT_FOUND, "User not found!");
      } else {
        UserRepository.update(
          req.params.id,
          req.body,
          req.headers["x-access-content"]
        )
          .then(userInfo => {
            if (userInfo) {
              sendReponse(res, httpStatus.OK, {
                status: "success",
                message: "User updated successfully!!!",
                data: { user: userInfo }
              });
            } else {
              sendReponse(res, httpStatus.OK, {
                status: "success",
                message: "User not found!!!",
                data: null
              });
            }
          })
          .catch(err => {
            sendReponse(res, httpStatus.INTERNAL_SERVER_ERROR, err);
            console.error.bind(console, `Error ${err}`);
          });
      }
    } catch (error) {
      console.log(error);
      sendReponse(res, httpStatus.INTERNAL_SERVER_ERROR, error);
      console.error.bind(console, `Error ${error}`);
    }
  }

  delete(req, res) {
    try {
      if (!req.params.id) {
        return sendReponse(res, httpStatus.NOT_FOUND, "User not found!");
      } else {
        UserRepository.delete(req.params.id, req.headers["x-access-content"])
          .then(userInfo => {
            if (userInfo) {
              sendReponse(
                res,
                httpStatus.OK,
                `User ${userInfo.name} deleted with success!`
              );
            } else {
              sendReponse(res, httpStatus.OK, {
                status: "success",
                message: "User not found!!!",
                data: null
              });
            }
          })
          .catch(err => {
            sendReponse(res, httpStatus.INTERNAL_SERVER_ERROR, err);
            console.error.bind(console, `Error ${err}`);
          });
      }
    } catch (error) {
      sendReponse(res, httpStatus.INTERNAL_SERVER_ERROR, error);
      console.error.bind(console, `Error ${error}`);
    }
  }
}

export default new UserController();
