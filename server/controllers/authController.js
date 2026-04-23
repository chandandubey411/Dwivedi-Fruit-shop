import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    const userExists = await User.findOne({ phone });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this phone number' });
    }

    const user = await User.create({ name, phone, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        isAdmin: user.isAdmin,
        addresses: user.addresses,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        isAdmin: user.isAdmin,
        addresses: user.addresses,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid phone or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        addresses: user.addresses,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.addresses.push(req.body); // expecting { street, city, state, zip }
      const updatedUser = await user.save();
      res.json(updatedUser.addresses);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.id);
      const updatedUser = await user.save();
      res.json(updatedUser.addresses);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const addressIndex = user.addresses.findIndex(a => a._id.toString() === req.params.id);
      if (addressIndex !== -1) {
        user.addresses[addressIndex] = { ...user.addresses[addressIndex].toObject(), ...req.body };
        const updatedUser = await user.save();
        res.json(updatedUser.addresses);
      } else {
        res.status(404).json({ message: 'Address not found' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
