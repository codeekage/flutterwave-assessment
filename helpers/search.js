/* eslint-disable camelcase */
const iterate = (obj) => {
  const value = {};
  return Object.keys(obj).map((key) => {
    if (typeof obj[key] === 'object') {
      return iterate(obj[key]);
    }
    Object.assign(value, { [`${key}`]: `${obj[key]}` });
    return value;
  });
};

function findLabel(data, label) {
  const field = iterate(data).flat(Infinity);
  const [value] = field.map((e) => e[label]).filter((el) => el != null);
  return value;
}

function searchData(data, field) {
  const fieldSplit = field.split('.');
  const firstIndex = fieldSplit[0];

  if (!Object.keys(data).includes(firstIndex)) {
    return {
      message: `field ${field} is missing from data.`,
      status: 'error',
      data: null,
    };
  }
  let field_value;
  if (fieldSplit.length > 1) {
    const lastIndex = fieldSplit[fieldSplit.length - 1];
    field_value = findLabel(data[firstIndex], lastIndex);
    if (!field_value) {
      return {
        message: `field ${field} is missing from data.`,
        status: 'error',
        data: null,
      };
    }
    return {
      message: null,
      status: 'success',
      data: field_value,
    };
  }
  field_value = data[field];
  return {
    message: null,
    status: 'success',
    data: field_value,
  };
}

function validateRule({
  condition, field_value, condition_value, success, error,
}) {
  let response;
  let code;
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
  return {
    response,
    code,
  };
}

module.exports = {
  findLabel,
  searchData,
  validateRule,
};
