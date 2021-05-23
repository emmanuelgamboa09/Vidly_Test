/**
 *
 * @param  handler
 * @returns
 * only needed if express async error cant handle it
 */

module.exports = function asyncMiddleware(handler) {
  return async function (req, res, next) {
    try {
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  };
};
