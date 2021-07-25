const { pubsub } = require("../pubsub");

function newLinkSubscribe() {
  return pubsub.asyncIterator("NEW_LINK");
}

function newVoteSubscribe() {
  return pubsub.asyncIterator("NEW_VOTE");
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: (payload) => payload,
};

const newVote = {
  subscribe: newVoteSubscribe,
  resolve: payload => {
    return payload
  },
}

module.exports = {
  newLink,
  newVote,
};
