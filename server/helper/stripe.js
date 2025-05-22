// helpers/stripe.js
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // store secret in env

module.exports = stripe;
