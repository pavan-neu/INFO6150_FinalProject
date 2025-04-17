import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_51REiZLP38uEKSQ8Dyz8v4aMSfhp5FOUkhR4Fe7F4Qncr0GbZRSusYrHNKgUiRJ1Wsru6Tme6HUSHoeItKF1gNqFl00oWeH6sl4');

export default stripePromise;