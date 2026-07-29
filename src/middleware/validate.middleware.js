const { sendError } = require('../utils/response.util');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return sendError(res, errorMessage, 400);
    }
    next();
  };
};

module.exports = validate;
