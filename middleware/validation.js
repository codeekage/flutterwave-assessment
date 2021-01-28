const Joi = require('joi');

// eslint-disable-next-line consistent-return
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

function validateRuleSchema(req, res, next) {
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
    return res.status(400).json({
      message: validation.error.details[0].message
        .replace(/['"]+/g, '')
        .replace('must', 'should')
        .replace('of type object', `${findVowels(errType)}`),
      status: 'error',
      data: null,
    });
  }

  return next();
}

module.exports = {
  validateRuleSchema,
};
