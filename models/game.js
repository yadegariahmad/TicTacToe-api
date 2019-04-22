const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema(
  {
    date: {
      type: Date,
      required: true
    },
    draw: {
      type: Boolean,
      default: false
    },
    winner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    players: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Game', gameSchema);