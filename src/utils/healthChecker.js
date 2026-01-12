/**
 * ===================================
 * UTILITY: HEALTH CHECKER
 * ===================================
 * Các hàm kiểm tra và cảnh báo chỉ số sức khỏe
 */

/**
 * Kiểm tra BMI và trả về đánh giá
 * @param {number} weight - Cân nặng (kg)
 * @param {number} height - Chiều cao (cm)
 * @returns {object} - Kết quả đánh giá BMI
 */
const checkBMI = (weight, height) => {
    if (!weight || !height) {
        return null;
    }

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const bmiRounded = parseFloat(bmi.toFixed(1));

    let status, advice;

    if (bmi < 18.5) {
        status = 'underweight';
        advice = 'Bạn đang thiếu cân. Nên tăng cường dinh dưỡng và ăn uống đầy đủ.';
    } else if (bmi < 25) {
        status = 'normal';
        advice = 'Chỉ số BMI của bạn bình thường. Hãy duy trì lối sống lành mạnh!';
    } else if (bmi < 30) {
        status = 'overweight';
        advice = 'Bạn đang thừa cân. Nên tập thể dục và điều chỉnh chế độ ăn.';
    } else {
        status = 'obese';
        advice = 'Bạn đang béo phì. Nên tham khảo ý kiến bác sĩ và có kế hoạch giảm cân.';
    }

    return {
        bmi: bmiRounded,
        status,
        advice
    };
};

/**
 * Kiểm tra huyết áp và trả về cảnh báo
 * @param {number} systolic - Huyết áp tâm thu
 * @param {number} diastolic - Huyết áp tâm trương
 * @returns {object} - Kết quả đánh giá huyết áp
 */
const checkBloodPressure = (systolic, diastolic) => {
    if (!systolic || !diastolic) {
        return null;
    }

    let status, advice, isWarning = false;

    if (systolic < 90 || diastolic < 60) {
        status = 'low';
        advice = 'Huyết áp thấp. Nên uống đủ nước và ăn uống đầy đủ.';
        isWarning = true;
    } else if (systolic <= 120 && diastolic <= 80) {
        status = 'normal';
        advice = 'Huyết áp bình thường. Tiếp tục duy trì!';
    } else if (systolic <= 140 || diastolic <= 90) {
        status = 'elevated';
        advice = 'Huyết áp hơi cao. Nên theo dõi thường xuyên và giảm muối.';
        isWarning = true;
    } else {
        status = 'high';
        advice = 'Huyết áp cao! Nên đi khám bác sĩ ngay.';
        isWarning = true;
    }

    return {
        systolic,
        diastolic,
        status,
        advice,
        isWarning
    };
};

/**
 * Kiểm tra nhịp tim và trả về cảnh báo
 * @param {number} heartRate - Nhịp tim (bpm)
 * @returns {object} - Kết quả đánh giá nhịp tim
 */
const checkHeartRate = (heartRate) => {
    if (!heartRate) {
        return null;
    }

    let status, advice, isWarning = false;

    if (heartRate < 60) {
        status = 'low';
        advice = 'Nhịp tim thấp (nhịp chậm). Nếu không phải vận động viên, nên theo dõi.';
        isWarning = true;
    } else if (heartRate <= 100) {
        status = 'normal';
        advice = 'Nhịp tim bình thường.';
    } else {
        status = 'high';
        advice = 'Nhịp tim cao! Nên nghỉ ngơi và theo dõi.';
        isWarning = true;
    }

    return {
        heartRate,
        status,
        advice,
        isWarning
    };
};

/**
 * Phân tích tổng hợp các chỉ số sức khỏe
 * @param {object} healthData - Dữ liệu sức khỏe
 * @returns {object} - Kết quả phân tích tổng hợp
 */
const analyzeHealthData = (healthData) => {
    const warnings = [];
    const analysis = {};

    // Kiểm tra BMI
    if (healthData.weight && healthData.height) {
        analysis.bmi = checkBMI(healthData.weight, healthData.height);
        if (analysis.bmi && analysis.bmi.status !== 'normal') {
            warnings.push({
                type: 'bmi',
                message: analysis.bmi.advice
            });
        }
    }

    // Kiểm tra huyết áp
    if (healthData.bloodPressure) {
        analysis.bloodPressure = checkBloodPressure(
            healthData.bloodPressure.systolic,
            healthData.bloodPressure.diastolic
        );
        if (analysis.bloodPressure && analysis.bloodPressure.isWarning) {
            warnings.push({
                type: 'bloodPressure',
                message: analysis.bloodPressure.advice
            });
        }
    }

    // Kiểm tra nhịp tim
    if (healthData.heartRate) {
        analysis.heartRate = checkHeartRate(healthData.heartRate);
        if (analysis.heartRate && analysis.heartRate.isWarning) {
            warnings.push({
                type: 'heartRate',
                message: analysis.heartRate.advice
            });
        }
    }

    return {
        analysis,
        warnings,
        hasWarnings: warnings.length > 0
    };
};

module.exports = {
    checkBMI,
    checkBloodPressure,
    checkHeartRate,
    analyzeHealthData
};
