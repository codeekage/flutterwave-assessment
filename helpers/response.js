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

function errorBuilder({ field, field_value, condition, condition_value }) {
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
}