/**
 * ===================================
 * CONTROLLER: DOCTOR - QUẢN LÝ BÁC SĨ
 * ===================================
 */

const doctorService = require('../services/doctorService');
const { successResponse, paginatedResponse } = require('../utils/responseHelper');

const createDoctor = async (req, res, next) => {
    try {
        const doctor = await doctorService.createDoctor(req.body);
        return successResponse(res, 201, 'Tạo bác sĩ thành công', doctor);
    } catch (error) {
        next(error);
    }
};

const getDoctors = async (req, res, next) => {
    try {
        const { doctors, pagination } = await doctorService.getDoctors(req.query);
        return paginatedResponse(res, doctors, pagination);
    } catch (error) {
        next(error);
    }
};

const getAvailableDoctors = async (req, res, next) => {
    try {
        const doctors = await doctorService.getAvailableDoctors();
        return successResponse(res, 200, 'Thành công', doctors);
    } catch (error) {
        next(error);
    }
};

const getDoctorById = async (req, res, next) => {
    try {
        const doctor = await doctorService.getDoctorById(req.params.id);
        return successResponse(res, 200, 'Thành công', doctor);
    } catch (error) {
        next(error);
    }
};

const updateDoctor = async (req, res, next) => {
    try {
        const doctor = await doctorService.updateDoctor(req.params.id, req.body);
        return successResponse(res, 200, 'Cập nhật bác sĩ thành công', doctor);
    } catch (error) {
        next(error);
    }
};

const deleteDoctor = async (req, res, next) => {
    try {
        await doctorService.deleteDoctor(req.params.id);
        return successResponse(res, 200, 'Xóa bác sĩ thành công');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createDoctor,
    getDoctors,
    getAvailableDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
};

