const Activity = require('../models/activityModel');

// CRUD operations
exports.getAllActivities = async (req, res) => {
    try {
        const activities = await Activity.find();
        res.status(200).json(activities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.status(200).json(activity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addActivity = async (req, res) => {
      const { name, userId } = req.body;
      
   
      try {
          const newActivity = new Activity({ name, userId }); 
          await newActivity.save();
          console.log('New Activity:', newActivity);
          res.status(201).json(newActivity);
      } catch (err) {
          res.status(400).json({ message: err.message });
      }
};


exports.updateActivity = async (req, res) => {
    try {
        const updatedActivity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedActivity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.status(200).json(updatedActivity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteActivity = async (req, res) => {
    try {
        await Activity.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Activity deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Activity actions


exports.startActivity = async (req, res) => {
  try {
    // Ensure no other activities are ongoing
    const ongoingActivity = await Activity.findOne({ status: 'Ongoing' });
    if (ongoingActivity) {
      return res.status(400).json({ message: 'Another activity is already ongoing. Please pause or end it before starting a new one.' });
    }

    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    activity.status = 'Ongoing';
    activity.startTime = new Date();
    activity.pausedDuration = 0;
    await activity.save();

    res.status(200).json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.endActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    activity.status = 'Completed';
    activity.endTime = new Date();
    await activity.save();

    res.status(200).json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.resumeActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Validate and parse startTime
    const newStartTime = new Date();
    if (isNaN(newStartTime.getTime())) {
      return res.status(400).json({ message: 'Invalid startTime format' });
    }

    // Ensure there is a valid pausedTime to calculate additional paused duration
    if (!activity.pausedTime) {
      return res.status(400).json({ message: 'No pausedTime found for activity' });
    }

    // Calculate additional paused duration since last pause
    const now = new Date();
    const lastPausedAt = new Date(activity.pausedTime);
    const pausedDurationSeconds = activity.pausedDuration || 0; // Initialize pausedDuration if undefined
    const additionalPausedTime = (now - lastPausedAt) / 1000; // in seconds

    // Adjust startTime considering paused duration
    const adjustedStartTime = new Date(newStartTime.getTime() - pausedDurationSeconds * 1000);

    // Update activity fields
    activity.status = 'Ongoing';
    activity.startTime = adjustedStartTime;
    activity.pausedDuration = 0; // Reset paused duration
    activity.pausedTime = null; // Clear paused time

    // Save activity
    await activity.save();

    res.status(200).json(activity);
  } catch (err) {
    console.error(`Error in resuming activity: ${err.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};






exports.pauseActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Store the current time as pausedTime
    const pausedTime = new Date();

    // Update activity fields
    activity.status = 'Paused';
    activity.pausedTime = pausedTime; // Store the time when activity was paused
    activity.lastPausedAt = pausedTime; // Record time of pause
    activity.logs.push({ action: 'pause', timestamp: pausedTime });

    // Save activity
    await activity.save();

    res.status(200).json(activity);
  } catch (err) {
    console.error(`Error in pausing activity: ${err.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};




