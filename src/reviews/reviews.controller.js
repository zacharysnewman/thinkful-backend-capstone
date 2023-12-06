const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

async function reviewExists(request, response, next) {
  const review = await service.read(request.params.reviewId);
  if (review) {
    response.locals.review = review;
    next();
  } else {
    next({ status: 404, message: `Review cannot be found.` });
  }
}

async function _delete(request, response) {
  await service.delete(request.params.reviewId);
  response.sendStatus(204);
}

async function list(request, response) {
  const reviews = await service.list(request.params.movieId);
  response.json({ data: reviews });
}

function hasMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return next();
  }
  methodNotAllowed(request, response, next);
}

function noMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return methodNotAllowed(request, response, next);
  }
  next();
}

async function update(request, response) {
  const review = { ...response.locals.review, ...request.body.data };
  const updatedReview = await service.update(review);
  response.json({ data: updatedReview });
}

module.exports = {
  delete: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(_delete),
  ],
  list: [hasMovieIdInPath, asyncErrorBoundary(list)],
  update: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};
