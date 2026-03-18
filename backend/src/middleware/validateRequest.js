export function validateRequest({ body, query, params } = {}) {
  return (req, res, next) => {
    if (body) {
      const parsedBody = body.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({
          message: "Invalid request body",
          errors: parsedBody.error.issues,
        });
      }
      req.body = parsedBody.data;
    }

    if (query) {
      const parsedQuery = query.safeParse(req.query);
      if (!parsedQuery.success) {
        return res.status(400).json({
          message: "Invalid query params",
          errors: parsedQuery.error.issues,
        });
      }
      req.query = parsedQuery.data;
    }

    if (params) {
      const parsedParams = params.safeParse(req.params);
      if (!parsedParams.success) {
        return res.status(400).json({
          message: "Invalid path params",
          errors: parsedParams.error.issues,
        });
      }
      req.params = parsedParams.data;
    }

    return next();
  };
}
