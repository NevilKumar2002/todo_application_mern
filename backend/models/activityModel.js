const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Ongoing', 'Paused', 'Completed'],
        default: 'Pending'
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    pausedTime: {
        type: Date
    },
    pausedDuration: {
        type: Number,
        default: 0
    },
    logs: [
        {
            action: {
                type: String,
                enum: ['start', 'pause', 'resume', 'end'],
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

module.exports = mongoose.model('Activity', activitySchema);
