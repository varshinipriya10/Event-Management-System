const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:4000' })); // Explicitly allow frontend origin

// MongoDB Connection
const mongoURI = 'mongodb://localhost:27017/eventManagement';
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['User', 'Admin', 'Organiser'], default: 'User' },
  createdAt: { type: Date, default: Date.now },
});

// User Model
const User = mongoose.model('User', userSchema);

// Event Schema
const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  eventDescription: { type: String, required: true },
  eventLocation: { type: String, required: true },
  price: { type: Number, required: true },
  capacity: { type: Number, required: true },
  category: { type: String, required: true },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

// Event Model
const Event = mongoose.model('Event', eventSchema);

// Cart Schema
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Cart Model
const Cart = mongoose.model('Cart', cartSchema);

// Registration Endpoint
app.post('/api/users/register', async (req, res) => {
  const { firstName, lastName, email, phone, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Login Endpoint
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    res.status(200).json({
      message: 'Login successful.',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Create Event Endpoint
app.post('/api/events', async (req, res) => {
  const { eventName, eventDate, eventDescription, eventLocation, price, capacity, category, organizerId } = req.body;

  try {
    const organizer = await User.findById(organizerId);
    if (!organizer || organizer.role !== 'Organiser') {
      return res.status(400).json({ message: 'Invalid organizer or insufficient permissions.' });
    }

    const newEvent = new Event({
      eventName,
      eventDate,
      eventDescription,
      eventLocation,
      price,
      capacity,
      category,
      organizerId,
    });

    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully.', event: newEvent });
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Get All Events Endpoint
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().populate('organizerId', 'firstName lastName');
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Add Event to Cart Endpoint
app.post('/api/cart/add', async (req, res) => {
  const { userId, eventId } = req.body;

  console.log('Received add to cart request:', { userId, eventId }); // Debug log

  try {
    // Validate user and event
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found for ID:', userId); // Debug log
      return res.status(400).json({ message: 'User not found.' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      console.log('Event not found for ID:', eventId); // Debug log
      return res.status(400).json({ message: 'Event not found.' });
    }

    // Find or create cart for the user
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      console.log('Creating new cart for user:', userId); // Debug log
      cart = new Cart({ userId, events: [] });
    }

    // Check for duplicates
    if (cart.events.includes(eventId)) {
      console.log('Event already in cart:', eventId); // Debug log
      return res.status(400).json({ message: 'Event already in cart.' });
    }

    // Add event to cart
    cart.events.push(eventId);
    cart.updatedAt = Date.now();
    await cart.save();
    console.log('Event added to cart successfully:', { userId, eventId }); // Debug log

    res.status(200).json({ message: 'Event added to cart successfully.' });
  } catch (error) {
    console.error('Error adding event to cart:', error); // Detailed error log
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Get User's Cart Endpoint
app.get('/api/cart/:userId', async (req, res) => {
  const { userId } = req.params;

  console.log('Fetching cart for user:', userId); // Debug log

  try {
    const cart = await Cart.findOne({ userId }).populate({
      path: 'events',
      populate: { path: 'organizerId', select: 'firstName lastName' },
    });

    if (!cart) {
      console.log('No cart found for user:', userId); // Debug log
      return res.status(200).json({ events: [] });
    }

    console.log('Cart fetched successfully:', cart); // Debug log
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error); // Detailed error log
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));