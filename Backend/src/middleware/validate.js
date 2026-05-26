const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => issue.message);
    const error = new Error(errors.join(', '));
    error.statusCode = 400;
    return next(error);
  }

  req.body = result.data;
  return next();
};

module.exports = validate;
