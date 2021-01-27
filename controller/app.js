const { request, response: _response } = require('express');
const Joi = require('joi');

function responseBuilder({
  status,
  error,
  field,
  field_value,
  condition,
  condition_value,
}) {
  return {
    message: `field ${field} successfully validated.`,
    status,
    data: {
      validation: {
        error,
        field,
        field_value,
        condition,
        condition_value,
      },
    },
  };
}

function findVowels(value) {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  if (value !== undefined && value.length > 0) {
    const firstIndex = value[0];
    if (vowels.includes(firstIndex)) {
      return `an ${value}`;
    }
    return `a ${value}`;
  }
}

/**
 *
 * @param {request} req
 * @param {_response} res
 */
function rootController(req, res) {
  res.status(200).json({
    message: 'My Rule-Validation API',
    status: 'success',
    data: {
      name: 'Abraham Agiri, Jr.',
      github: '@codeekage',
      email: 'agirabrahamjunior@gmail.com',
      mobile: '07066229833',
      twitter: '@codeekage',
    },
  });
}

/**
 *
 * @param {request} req
 * @param {response} res
 */
function validateField(req, res, next) {
  const CONDITIONS = ['eq', 'neq', 'gt', 'gte', 'contains'];
  const schema = Joi.object({
    rule: Joi.object({
      field: Joi.string().required(),
      condition: Joi.string()
        .valid(...CONDITIONS)
        .required(),
      condition_value: Joi.any().required(),
    }).required(),
    data: Joi.any().required(),
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    const errType = validation.error.details[0].context.type;
    console.log(errType);
    return res.status(400).json({
      message: validation.error.details[0].message
        .replace(/['"]+/g, '')
        .replace('must', 'should')
        .replace('of type object', `${findVowels(errType)}`),
      status: 'error',
      data: null,
    });
  }

  const { rule, data } = req.body;
  const { condition, condition_value, field } = rule;

  let response;
  let code = 400;

  for (let i = 0; i < Object.keys(data).length; i++) {
    const keys = Object.keys(data);
    if (typeof data[keys[i]] === 'object') {
      if (!Object.keys(data[keys[i]]).includes(field.split('.')[1])) {
        return res.status(400).json({
          message: `field ${field} is missing from data.`,
          status: 'error',
          data: null,
        });
      }
    }
  }

  if(!Object.keys(data).includes(field.split('.')[0])){
    return res.status(400).json({
      message: `field ${field} is missing from data.`,
      status: 'error',
      data: null,
    });
  }
  const fieldSplit = field.split('.');
  let field_value;
  for (let i = 0; i < fieldSplit.length; i++) {
    const m = data[fieldSplit[0]];
    field_value = m[fieldSplit[i]];
  }
  const error = {
    message: `field ${field} failed validation.`,
    status: 'error',
    data: {
      validation: {
        error: true,
        field,
        field_value,
        condition,
        condition_value,
      },
    },
  };
  switch (condition) {
    case 'eq':
      if (condition_value === field_value) {
        code = 200;
        response = responseBuilder({
          condition,
          condition_value,
          field,
          field_value,
          error: false,
          status: 'success',
        });
      } else { response = error; code = 400 }
      break;
    case 'gte':
      if (field_value >= condition_value) {
        code = 200;
        response = responseBuilder({
          condition,
          condition_value,
          field,
          field_value,
          error: false,
          status: 'success',
        });
      } else { response = error; code = 400 }
      break;
    case 'gt':
      if (condition_value >= field_value) {
        code = 200;
        response = responseBuilder({
          condition,
          condition_value,
          field,
          field_value,
          error: false,
          status: 'success',
        });
      } else { response = error; code = 400 }
      break;
    case 'neq':
      if (condition_value !== field_value) {
        code = 200;
        response = responseBuilder({
          condition,
          condition_value,
          field,
          field_value,
          error: false,
          status: 'success',
        });
      } else { response = error; code = 400 }
      break;
    case 'contains':
      console.log(field_value)
      if (field_value.length !== undefined && field_value.length >= 0) {
        console.log(field_value.includes(condition_value));
        if (field_value.includes(condition_value)) {
          code = 200;
          response = responseBuilder({
            condition,
            condition_value,
            field,
            field_value,
            error: false,
            status: 'success',
          });
        } else { response = error; code = 400 }
      } else { response = error; code = 400 }
      break;
    default:
      code = 400
      response = error;
    break;
  }

  return res.status(code).json(response);
}

module.exports = {
  rootController,
  validateField,
};
