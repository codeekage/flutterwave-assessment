/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
const { request, response: _response } = require('express');
const { errorBuilder, responseBuilder } = require('../helpers/response');
const { searchData, validateRule } = require('../helpers/search');

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
  try {
    const { rule, data } = req.body;
    const { condition, condition_value, field } = rule;

    const searchField = searchData(data, field);
    if (!searchField.data) {
      return res.status(400).json(searchField);
    }
    const field_value = searchField.data;

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

    const { code, response } = validateRule({
      condition,
      condition_value,
      error,
      success,
      field_value,
    });

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
