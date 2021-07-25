const { pubsub } = require("../pubsub");

function newLinkSubscribe() {
  return pubsub.asyncIterator("NEW_LINK");
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: (payload) => payload,
};

module.exports = {
  newLink,
};
