const db = require("../db/connection");

const tableName = "reviews";

async function _delete(reviewId) {
  return db("reviews").select("reviews.*").where({ review_id: reviewId }).del();
}

async function list(movie_id) {
  const reviews = await db("reviews").select("reviews.*").where({ movie_id });
  return Promise.all(reviews.map(setCritic));
}

async function read(reviewId) {
  return db("reviews")
    .select("reviews.*")
    .where({ review_id: reviewId })
    .then((records) => records[0]);
}

async function readCritic(critic_id) {
  return db("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

async function update(review) {
  return db(tableName)
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then(setCritic);
}

module.exports = {
  delete: _delete,
  list,
  read,
  update,
};
