const { request, response: _response } = require('express');
const { errorBuilder, responseBuilder } = require('../helpers/response');

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
function validateField(req, res) {
  try {
    const { rule, data } = req.body;
    const { condition, condition_value, field } = rule;
    let response;
    let code = 400;
    let field_value;
    const fieldSplit = field.split('.');

    if (fieldSplit.length > 1) {
      for (let i = 0; i < Object.keys(data).length; i++) {
        const keys = Object.keys(data);
        if (typeof data[keys[i]] === 'object') {
          if (!Object.keys(data[keys[i]]).includes(fieldSplit[1])) {
            return res.status(400).json({
              message: `field ${field} is missing from data.`,
              status: 'error',
              data: null,
            });
          }
        }
      }
    }

    if (!Object.keys(data).includes(fieldSplit[0])) {
      return res.status(400).json({
        message: `field ${field} is missing from data.`,
        status: 'error',
        data: null,
      });
    }

    if (fieldSplit.length > 1) {
      for (let i = 0; i < fieldSplit.length; i++) {
        const m = data[fieldSplit[0]];
        field_value = m[fieldSplit[i]];
      }
    } else {
      field_value = data[field];
    }

    const error = errorBuilder({
      field,
      field_value,
      condition,
      condition_value,
    });
    
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
        } else {
          response = error;
          code = 400;
        }
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
        } else {
          response = error;
          code = 400;
        }
        break;
      case 'gt':
        if (field_value > condition_value) {
          code = 200;
          response = responseBuilder({
            condition,
            condition_value,
            field,
            field_value,
            error: false,
            status: 'success',
          });
        } else {
          response = error;
          code = 400;
        }
        break;
      case 'neq':
        if (field_value !== condition_value) {
          code = 200;
          response = responseBuilder({
            condition,
            condition_value,
            field,
            field_value,
            error: false,
            status: 'success',
          });
        } else {
          response = error;
          code = 400;
        }
        break;
      case 'contains':
        if (field_value.length !== undefined && field_value.length >= 0) {
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
          } else {
            response = error;
            code = 400;
          }
        } else {
          response = error;
          code = 400;
        }
        break;
      default:
        code = 400;
        response = error;
        break;
    }
    return res.status(code).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'An unexpected error occured.',
      status: 'error',
      data: null,
    });
  }
}

module.exports = {
  rootController,
  validateField,
};
