import Settings from '../models/Settings.js';

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({}); // Creates default settings
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
