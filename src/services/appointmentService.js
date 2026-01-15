/**
 * ===================================
 * SERVICE: APPOINTMENT - QUẢN LÝ LỊCH HẸN
 * ===================================
 */

const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

/**
 * Tạo lịch hẹn mới
 */
const createAppointment = async (userId, appointmentData) => {
    // Kiểm tra bác sĩ có tồn tại không
    const doctor = await Doctor.findById(appointmentData.doctorId);
    if (!doctor) {
        const error = new Error('Không tìm thấy bác sĩ');
        error.statusCode = 404;
        throw error;
    }

    // Kiểm tra bác sĩ có sẵn sàng không
    if (doctor.status !== 'available') {
        const error = new Error('Bác sĩ hiện đang bận');
        error.statusCode = 400;
        throw error;
    }

    const appointment = await Appointment.create({
        userId,
        ...appointmentData,
        status: 'pending'
    });

    return appointment;
};

/**
 * Lấy lịch hẹn của user
 */
const getUserAppointments = async (userId, query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { userId };

    if (query.status) {
        filter.status = query.status;
    }

    const appointments = await Appointment.find(filter)
        .populate('doctorId', 'name specialty image')
        .skip(skip)
        .limit(limit)
        .sort({ appointmentDate: -1, createdAt: -1 });

    const total = await Appointment.countDocuments(filter);

    return {
        appointments,
        pagination: {
            page,
            limit,
            total
        }
    };
};

/**
 * Lấy tất cả lịch hẹn (cho admin)
 */
const getAllAppointments = async (query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (query.status) {
        filter.status = query.status;
    }

    if (query.doctorId) {
        filter.doctorId = query.doctorId;
    }

    const appointments = await Appointment.find(filter)
        .populate('userId', 'name email')
        .populate('doctorId', 'name specialty image')
        .skip(skip)
        .limit(limit)
        .sort({ appointmentDate: -1, createdAt: -1 });

    const total = await Appointment.countDocuments(filter);

    return {
        appointments,
        pagination: {
            page,
            limit,
            total
        }
    };
};

/**
 * Lấy một lịch hẹn theo ID
 */
const getAppointmentById = async (appointmentId, userId = null) => {
    const filter = { _id: appointmentId };
    if (userId) {
        filter.userId = userId;
    }

    const appointment = await Appointment.findOne(filter)
        .populate('userId', 'name email')
        .populate('doctorId', 'name specialty image qualification');

    if (!appointment) {
        const error = new Error('Không tìm thấy lịch hẹn');
        error.statusCode = 404;
        throw error;
    }

    return appointment;
};

/**
 * Cập nhật trạng thái lịch hẹn (admin duyệt/từ chối)
 */
const updateAppointmentStatus = async (appointmentId, status, adminNote = '') => {
    const validStatuses = ['approved', 'rejected', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
        const error = new Error('Trạng thái không hợp lệ');
        error.statusCode = 400;
        throw error;
    }

    const updateData = { status };
    if (adminNote) {
        updateData.adminNote = adminNote;
    }

    const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        updateData,
        { new: true, runValidators: true }
    ).populate('doctorId', 'name specialty');

    if (!appointment) {
        const error = new Error('Không tìm thấy lịch hẹn');
        error.statusCode = 404;
        throw error;
    }

    return appointment;
};

/**
 * Hủy lịch hẹn (user)
 */
const cancelAppointment = async (appointmentId, userId) => {
    const appointment = await Appointment.findOneAndUpdate(
        { _id: appointmentId, userId, status: 'pending' },
        { status: 'cancelled' },
        { new: true }
    );

    if (!appointment) {
        const error = new Error('Không thể hủy lịch hẹn này');
        error.statusCode = 400;
        throw error;
    }

    return appointment;
};

module.exports = {
    createAppointment,
    getUserAppointments,
    getAllAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    cancelAppointment
};

