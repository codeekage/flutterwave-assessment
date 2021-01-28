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
      email: process.env.EMAIL,
      mobile: process.env.PHONE_NUMBER,
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
    const payload = {
      field,
      field_value,
      condition,
      condition_value,
    };
    const error = errorBuilder(payload);
    const success = responseBuilder(payload);

    const { code, response } = validateRule({
      ...payload,
      error,
      success,
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
