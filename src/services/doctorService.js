/**
 * ===================================
 * SERVICE: DOCTOR - QUẢN LÝ BÁC SĨ
 * ===================================
 */

const Doctor = require('../models/Doctor');

/**
 * Tạo bác sĩ mới
 */
const createDoctor = async (doctorData) => {
    const doctor = await Doctor.create(doctorData);
    return doctor;
};

/**
 * Lấy tất cả bác sĩ
 */
const getDoctors = async (query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    
    if (query.specialty) {
        filter.specialty = query.specialty;
    }
    
    if (query.status) {
        filter.status = query.status;
    }

    const doctors = await Doctor.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await Doctor.countDocuments(filter);

    return {
        doctors,
        pagination: {
            page,
            limit,
            total
        }
    };
};

/**
 * Lấy một bác sĩ theo ID
 */
const getDoctorById = async (doctorId) => {
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
        const error = new Error('Không tìm thấy bác sĩ');
        error.statusCode = 404;
        throw error;
    }

    return doctor;
};

/**
 * Cập nhật bác sĩ
 */
const updateDoctor = async (doctorId, updateData) => {
    const doctor = await Doctor.findByIdAndUpdate(
        doctorId,
        updateData,
        { new: true, runValidators: true }
    );

    if (!doctor) {
        const error = new Error('Không tìm thấy bác sĩ');
        error.statusCode = 404;
        throw error;
    }

    return doctor;
};

/**
 * Xóa bác sĩ
 */
const deleteDoctor = async (doctorId) => {
    const doctor = await Doctor.findByIdAndDelete(doctorId);

    if (!doctor) {
        const error = new Error('Không tìm thấy bác sĩ');
        error.statusCode = 404;
        throw error;
    }

    return true;
};

/**
 * Lấy danh sách bác sĩ đang sẵn sàng (cho user)
 */
const getAvailableDoctors = async () => {
    const doctors = await Doctor.find({ status: 'available' })
        .sort({ name: 1 });
    
    return doctors;
};

module.exports = {
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
    getAvailableDoctors
};

