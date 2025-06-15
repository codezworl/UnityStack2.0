const Notification = require('../models/notification');
const Session = require('../models/session');
const Student = require('../models/Student');
const Developer = require('../models/Develpor');
const Admin = require('../models/admin');

// Create a notification
const createNotification = async (recipientId, recipientModel, senderId, senderModel, sessionId, type, message) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      recipientModel,
      sender: senderId,
      senderModel,
      sessionId,
      type,
      message
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Get notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.userRole;

    if (!userId || !userRole) {
      return res.status(400).json({ message: 'User information not found' });
    }

    const notifications = await Notification.find({
      recipient: userId,
      recipientModel: userRole.charAt(0).toUpperCase() + userRole.slice(1)
    })
    .sort({ createdAt: -1 })
    .limit(50);

    res.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Error marking notification as read' });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.userRole;

    if (!userId || !userRole) {
      return res.status(400).json({ message: 'User information not found' });
    }

    await Notification.updateMany(
      {
        recipient: userId,
        recipientModel: userRole.charAt(0).toUpperCase() + userRole.slice(1),
        read: false
      },
      { read: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Error marking all notifications as read' });
  }
};

// Create session notifications
exports.createSessionNotifications = async (sessionId, type) => {
  try {
    const session = await Session.findById(sessionId)
      .populate('studentId', 'firstName lastName')
      .populate('developerId', 'firstName lastName');

    if (!session) {
      throw new Error('Session not found');
    }

    const student = session.studentId;
    const developer = session.developerId;
    const admins = await Admin.find();

    switch (type) {
      case 'session_booked':
        // Notify developer
        await createNotification(
          developer._id,
          'Developer',
          student._id,
          'Student',
          sessionId,
          'session_booked',
          `${student.firstName} ${student.lastName} has booked a session with you on ${new Date(session.date).toLocaleDateString()} at ${session.startTime}`
        );

        // Notify admins
        for (const admin of admins) {
          await createNotification(
            admin._id,
            'Admin',
            student._id,
            'Student',
            sessionId,
            'session_booked',
            `${student.firstName} ${student.lastName} has booked a session with ${developer.firstName} ${developer.lastName} on ${new Date(session.date).toLocaleDateString()} at ${session.startTime}`
          );
        }
        break;

      case 'session_started':
        // Notify student
        await createNotification(
          student._id,
          'Student',
          developer._id,
          'Developer',
          sessionId,
          'session_started',
          `Your session with ${developer.firstName} ${developer.lastName} is starting now`
        );

        // Notify developer
        await createNotification(
          developer._id,
          'Developer',
          student._id,
          'Student',
          sessionId,
          'session_started',
          `Your session with ${student.firstName} ${student.lastName} is starting now`
        );

        // Notify admins
        for (const admin of admins) {
          await createNotification(
            admin._id,
            'Admin',
            student._id,
            'Student',
            sessionId,
            'session_started',
            `Session between ${student.firstName} ${student.lastName} and ${developer.firstName} ${developer.lastName} has started`
          );
        }
        break;

      case 'session_completed':
        // Notify student
        await createNotification(
          student._id,
          'Student',
          developer._id,
          'Developer',
          sessionId,
          'session_completed',
          `Your session with ${developer.firstName} ${developer.lastName} has been completed`
        );

        // Notify developer
        await createNotification(
          developer._id,
          'Developer',
          student._id,
          'Student',
          sessionId,
          'session_completed',
          `Your session with ${student.firstName} ${student.lastName} has been completed`
        );

        // Notify admins
        for (const admin of admins) {
          await createNotification(
            admin._id,
            'Admin',
            student._id,
            'Student',
            sessionId,
            'session_completed',
            `Session between ${student.firstName} ${student.lastName} and ${developer.firstName} ${developer.lastName} has been completed`
          );
        }
        break;
    }
  } catch (error) {
    console.error('Error creating session notifications:', error);
    throw error;
  }
};

module.exports = exports; 