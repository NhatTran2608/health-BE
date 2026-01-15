/**
 * ===================================
 * CONTROLLER: APPOINTMENT - QUẢN LÝ LỊCH HẸN
 * ===================================
 */

const appointmentService = require('../services/appointmentService');
const { successResponse, paginatedResponse } = require('../utils/responseHelper');

const createAppointment = async (req, res, next) => {
    try {
        const appointment = await appointmentService.createAppointment(req.user._id, req.body);
        return successResponse(res, 201, 'Đặt lịch thành công. Vui lòng chờ xác nhận từ admin.', appointment);
    } catch (error) {
        next(error);
    }
};

const getUserAppointments = async (req, res, next) => {
    try {
        const { appointments, pagination } = await appointmentService.getUserAppointments(
            req.user._id,
            req.query
        );
        return paginatedResponse(res, appointments, pagination);
    } catch (error) {
        next(error);
    }
};

const getAllAppointments = async (req, res, next) => {
    try {
        const { appointments, pagination } = await appointmentService.getAllAppointments(req.query);
        return paginatedResponse(res, appointments, pagination);
    } catch (error) {
        next(error);
    }
};

const getAppointmentById = async (req, res, next) => {
    try {
        const appointment = await appointmentService.getAppointmentById(
            req.params.id,
            req.user.role === 'admin' ? null : req.user._id
        );
        return successResponse(res, 200, 'Thành công', appointment);
    } catch (error) {
        next(error);
    }
};

const updateAppointmentStatus = async (req, res, next) => {
    try {
        const { status, adminNote } = req.body;
        const appointment = await appointmentService.updateAppointmentStatus(
            req.params.id,
            status,
            adminNote
        );
        
        const statusMessages = {
            approved: 'Đã duyệt lịch hẹn thành công',
            rejected: 'Đã từ chối lịch hẹn',
            completed: 'Đã hoàn thành lịch hẹn',
            cancelled: 'Đã hủy lịch hẹn'
        };
        
        return successResponse(res, 200, statusMessages[status] || 'Cập nhật thành công', appointment);
    } catch (error) {
        next(error);
    }
};

const cancelAppointment = async (req, res, next) => {
    try {
        const appointment = await appointmentService.cancelAppointment(req.params.id, req.user._id);
        return successResponse(res, 200, 'Hủy lịch hẹn thành công', appointment);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createAppointment,
    getUserAppointments,
    getAllAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    cancelAppointment
};

