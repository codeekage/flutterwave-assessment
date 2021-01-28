/* eslint-disable camelcase */
function responseBuilder({
  field,
  field_value,
  condition,
  condition_value,
}) {
  return {
    message: `field ${field} successfully validated.`,
    status: 'success',
    data: {
      validation: {
        error: false,
        field,
        field_value,
        condition,
        condition_value,
      },
    },
  };
}

function errorBuilder({
  field, field_value, condition, condition_value,
}) {
  return {
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
}

module.exports = {
  responseBuilder,
  errorBuilder,
};
