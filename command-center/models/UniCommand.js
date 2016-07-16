var mongoose = require('mongoose');

var uniCommandSchema = new mongoose.Schema({
    user: { type: 'String', required: true, index: true },
    timestamp: { type: 'Date', required: true, default: Date.now },
    command: { type: 'String', required: true },
});

uniCommandSchema.set('autoIndex', false);

// log command for a particular user
uniCommandSchema.statics.logCommandForUser = function(user_, command_, callback) {
    this.create({ user: user_, command: command_ }, callback);
}

module.exports = mongoose.model('UniCommand', uniCommandSchema);

