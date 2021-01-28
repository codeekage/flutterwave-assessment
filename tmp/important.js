/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
const { request, response: _response } = require('express');
const { errorBuilder, responseBuilder } = require('../helpers/response');
const { findLabel } = require('../helpers/search');

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
 * @param {_response} res
 */
function validateField(req, res) {
  let code = 400;
  let response;
  try {
    let field_value;
    const { rule, data } = req.body;
    const { condition, condition_value, field } = rule;

    const fieldSplit = field.split('.');
    const firstIndex = fieldSplit[0];

    if (fieldSplit.length > 1) {
      const lastIndex = fieldSplit[fieldSplit.length - 1];
      field_value = findLabel(data[firstIndex], lastIndex);
      if (!field_value) {
        return res.status(400).json({
          message: `field ${field} is missing from data.`,
          status: 'error',
          data: null,
        });
      }
    } else {
      field_value = data[field];
    }

    if (!Object.keys(data).includes(firstIndex)) {
      return res.status(400).json({
        message: `field ${field} is missing from data.`,
        status: 'error',
        data: null,
      });
    }

    const error = errorBuilder({
      field,
      field_value,
      condition,
      condition_value,
    });

    const success = responseBuilder({
      condition,
      condition_value,
      field,
      field_value,
    });

    switch (condition) {
      case 'eq':
        if (condition_value === field_value) {
          code = 200;
          response = success;
        } else {
          response = error;
          code = 400;
        }
        break;
      case 'gte':
        if (field_value >= condition_value) {
          code = 200;
          response = success;
        } else {
          response = error;
          code = 400;
        }
        break;
      case 'gt':
        if (field_value > condition_value) {
          code = 200;
          response = success;
        } else {
          response = error;
          code = 400;
        }
        break;
      case 'neq':
        if (field_value !== condition_value) {
          code = 200;
          response = success;
        } else {
          response = error;
          code = 400;
        }
        break;
      case 'contains':
        if (field_value.length !== undefined && field_value.length >= 0) {
          if (field_value.includes(condition_value)) {
            code = 200;
            response = success;
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
