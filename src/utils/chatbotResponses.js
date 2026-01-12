/**
 * ===================================
 * UTILITY: CHATBOT RESPONSES
 * ===================================
 * Các câu trả lời mẫu cho chatbot tư vấn sức khỏe
 * Logic đơn giản dựa trên từ khóa
 */

// Định nghĩa từ khóa và câu trả lời tương ứng
const keywordResponses = {
    // Chủ đề: Stress / Căng thẳng
    stress: {
        keywords: ['stress', 'căng thẳng', 'lo lắng', 'áp lực', 'lo âu', 'bồn chồn'],
        category: 'stress',
        responses: [
            'Căng thẳng kéo dài có thể ảnh hưởng đến sức khỏe. Bạn nên:\n1. Tập thở sâu 5-10 phút mỗi ngày\n2. Đi bộ hoặc tập thể dục nhẹ\n3. Ngủ đủ giấc (7-8 tiếng)\n4. Chia sẻ với người thân hoặc bạn bè\n5. Nếu tình trạng nghiêm trọng, hãy tham khảo ý kiến chuyên gia.',
            'Để giảm stress, bạn có thể thử:\n- Thiền định 10-15 phút mỗi ngày\n- Hạn chế caffeine và đồ uống có cồn\n- Lập danh sách công việc để quản lý thời gian tốt hơn\n- Dành thời gian cho sở thích cá nhân',
            'Stress là phản ứng bình thường của cơ thể, nhưng cần được kiểm soát. Hãy thử yoga, nghe nhạc thư giãn, hoặc đi dạo trong công viên để giải tỏa căng thẳng.'
        ]
    },

    // Chủ đề: Giấc ngủ
    sleep: {
        keywords: ['ngủ', 'mất ngủ', 'khó ngủ', 'ngủ không ngon', 'thức khuya', 'giấc ngủ', 'insomnia'],
        category: 'sleep',
        responses: [
            'Để cải thiện giấc ngủ, bạn nên:\n1. Đi ngủ và thức dậy đúng giờ mỗi ngày\n2. Tránh dùng điện thoại/máy tính trước khi ngủ 1 tiếng\n3. Phòng ngủ nên tối, mát và yên tĩnh\n4. Tránh ăn quá no hoặc uống nhiều nước trước khi ngủ\n5. Hạn chế caffeine sau 2 giờ chiều',
            'Mất ngủ có thể do nhiều nguyên nhân:\n- Stress và lo lắng\n- Thói quen ngủ không đều đặn\n- Sử dụng nhiều thiết bị điện tử\n\nHãy thử uống trà hoa cúc, đọc sách nhẹ nhàng trước khi ngủ.',
            'Giấc ngủ rất quan trọng cho sức khỏe. Người lớn cần ngủ 7-9 tiếng mỗi đêm. Nếu mất ngủ kéo dài hơn 2 tuần, bạn nên đi khám bác sĩ.'
        ]
    },

    // Chủ đề: Ăn uống / Dinh dưỡng
    nutrition: {
        keywords: ['ăn', 'ăn uống', 'dinh dưỡng', 'thức ăn', 'đồ ăn', 'chế độ ăn', 'giảm cân', 'tăng cân', 'béo', 'gầy'],
        category: 'nutrition',
        responses: [
            'Chế độ ăn uống lành mạnh bao gồm:\n1. Ăn nhiều rau xanh và trái cây\n2. Chọn ngũ cốc nguyên hạt\n3. Ưu tiên protein từ cá, thịt trắng, đậu\n4. Hạn chế đường và muối\n5. Uống đủ 2 lít nước mỗi ngày',
            'Để duy trì cân nặng hợp lý:\n- Ăn đủ bữa, không bỏ bữa\n- Chia nhỏ khẩu phần ăn\n- Nhai kỹ, ăn chậm\n- Tránh ăn vặt và đồ ăn nhanh\n- Kết hợp tập thể dục đều đặn',
            'Dinh dưỡng cân bằng là chìa khóa sức khỏe tốt. Mỗi bữa ăn nên có: 50% rau củ, 25% protein, 25% tinh bột. Hạn chế thực phẩm chế biến sẵn.'
        ]
    },

    // Chủ đề: Tập thể dục
    exercise: {
        keywords: ['tập', 'thể dục', 'vận động', 'gym', 'chạy bộ', 'thể thao', 'tập luyện'],
        category: 'exercise',
        responses: [
            'Lợi ích của tập thể dục đều đặn:\n1. Tăng cường sức khỏe tim mạch\n2. Kiểm soát cân nặng\n3. Giảm stress và lo âu\n4. Cải thiện giấc ngủ\n5. Tăng cường hệ miễn dịch\n\nNên tập ít nhất 30 phút/ngày, 5 ngày/tuần.',
            'Bắt đầu tập thể dục từ từ:\n- Đi bộ nhanh 15-20 phút mỗi ngày\n- Sau 2 tuần tăng lên 30 phút\n- Thêm các bài tập cardio nhẹ\n- Kết hợp tập sức mạnh 2-3 lần/tuần',
            'Không cần đến gym để khỏe mạnh! Bạn có thể:\n- Đi bộ hoặc đạp xe đi làm\n- Leo cầu thang thay vì thang máy\n- Tập các bài tập tại nhà: plank, squat, push-up'
        ]
    },

    // Chủ đề: Đau đầu
    headache: {
        keywords: ['đau đầu', 'nhức đầu', 'đau nửa đầu', 'migraine', 'chóng mặt'],
        category: 'disease',
        responses: [
            'Đau đầu có thể do nhiều nguyên nhân:\n- Thiếu ngủ hoặc stress\n- Mất nước\n- Ngồi máy tính quá lâu\n- Căng cơ cổ vai\n\nHãy nghỉ ngơi, uống nước, và massage nhẹ vùng thái dương. Nếu đau kéo dài, hãy đi khám.',
            'Để phòng tránh đau đầu:\n1. Ngủ đủ giấc\n2. Uống đủ nước\n3. Nghỉ mắt 20 phút sau mỗi 2 giờ nhìn màn hình\n4. Tránh stress\n5. Hạn chế caffeine và rượu',
            'Nếu đau đầu kèm theo sốt cao, nôn mửa, hoặc mờ mắt, bạn cần đi khám ngay lập tức.'
        ]
    },

    // Chủ đề: Cảm cúm
    flu: {
        keywords: ['cảm', 'cúm', 'sổ mũi', 'ho', 'sốt', 'đau họng', 'viêm họng'],
        category: 'disease',
        responses: [
            'Khi bị cảm cúm nhẹ:\n1. Nghỉ ngơi nhiều\n2. Uống nhiều nước ấm\n3. Súc miệng nước muối\n4. Ăn cháo, súp nóng\n5. Giữ ấm cơ thể\n\nNếu sốt cao trên 39°C hoặc kéo dài 3 ngày, hãy đi khám.',
            'Để phòng cảm cúm:\n- Rửa tay thường xuyên\n- Đeo khẩu trang khi ra ngoài\n- Tăng cường vitamin C\n- Tập thể dục đều đặn\n- Ngủ đủ giấc',
            'Các triệu chứng cảm cúm thường kéo dài 7-10 ngày. Hãy nghỉ ngơi và uống nhiều nước. Nếu khó thở hoặc triệu chứng nặng hơn, cần đi khám ngay.'
        ]
    },

    // Chủ đề: Tiêu hóa
    digestion: {
        keywords: ['đau bụng', 'tiêu hóa', 'táo bón', 'tiêu chảy', 'đầy hơi', 'khó tiêu', 'dạ dày'],
        category: 'disease',
        responses: [
            'Để hệ tiêu hóa khỏe mạnh:\n1. Ăn nhiều chất xơ (rau, trái cây)\n2. Uống đủ nước\n3. Ăn chậm, nhai kỹ\n4. Hạn chế đồ chiên, cay nóng\n5. Tập thể dục đều đặn',
            'Nếu bị táo bón:\n- Uống nhiều nước (8-10 ly/ngày)\n- Ăn rau xanh, trái cây\n- Tập thể dục nhẹ\n- Không nhịn đi vệ sinh\n\nNếu bị tiêu chảy: bù nước và điện giải, ăn nhẹ.',
            'Đau bụng có thể do ăn uống không đúng cách hoặc bệnh lý. Nếu đau kéo dài, đau dữ dội, hoặc có máu trong phân, hãy đi khám ngay.'
        ]
    },

    // Chủ đề: Thuốc
    medicine: {
        keywords: ['thuốc', 'uống thuốc', 'tác dụng phụ', 'liều dùng'],
        category: 'other',
        responses: [
            'Lưu ý khi dùng thuốc:\n1. Đọc kỹ hướng dẫn sử dụng\n2. Uống đúng liều, đúng giờ\n3. Không tự ý ngừng thuốc\n4. Thông báo cho bác sĩ nếu có tác dụng phụ\n5. Không dùng thuốc hết hạn',
            'Việc sử dụng thuốc cần được bác sĩ kê đơn. Tôi khuyên bạn nên tham khảo ý kiến bác sĩ hoặc dược sĩ về loại thuốc cụ thể mà bạn đang quan tâm.',
            'Không tự ý mua thuốc kháng sinh hoặc thuốc kê đơn. Hãy đến cơ sở y tế để được khám và kê đơn phù hợp.'
        ]
    },

    // Chủ đề: Uống nước
    water: {
        keywords: ['nước', 'uống nước', 'khát', 'mất nước'],
        category: 'nutrition',
        responses: [
            'Uống đủ nước rất quan trọng:\n- Người lớn cần 2-2.5 lít/ngày\n- Uống nước đều đặn, không đợi khát\n- Nước lọc là tốt nhất\n- Hạn chế nước ngọt, có gas\n- Uống thêm khi tập thể dục hoặc trời nóng',
            'Dấu hiệu thiếu nước:\n- Khô miệng, khát nước\n- Nước tiểu sậm màu\n- Mệt mỏi, đau đầu\n- Da khô\n\nHãy uống nước ngay khi có những dấu hiệu này!',
            'Mẹo uống đủ nước mỗi ngày:\n- Mang theo bình nước\n- Đặt nhắc nhở uống nước\n- Ăn trái cây nhiều nước\n- Uống 1 ly nước trước mỗi bữa ăn'
        ]
    }
};

// Câu trả lời mặc định khi không nhận diện được từ khóa
const defaultResponses = [
    'Cảm ơn bạn đã hỏi. Tôi là chatbot tư vấn sức khỏe cơ bản. Bạn có thể hỏi tôi về:\n- Stress và căng thẳng\n- Giấc ngủ\n- Chế độ ăn uống\n- Tập thể dục\n- Các triệu chứng bệnh nhẹ\n\nNếu có vấn đề sức khỏe nghiêm trọng, vui lòng đến cơ sở y tế.',
    'Tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể mô tả chi tiết hơn về tình trạng sức khỏe hoặc thắc mắc của mình không?',
    'Xin lỗi, tôi không có đủ thông tin để trả lời câu hỏi này. Nếu bạn có triệu chứng bất thường, hãy tham khảo ý kiến bác sĩ.'
];

/**
 * Phát hiện từ khóa trong câu hỏi
 * @param {string} question - Câu hỏi của người dùng
 * @returns {object} - Kết quả phát hiện từ khóa
 */
const detectKeywords = (question) => {
    const lowerQuestion = question.toLowerCase();
    const detected = [];
    let matchedTopic = null;

    // Duyệt qua tất cả các chủ đề
    for (const [topic, data] of Object.entries(keywordResponses)) {
        for (const keyword of data.keywords) {
            if (lowerQuestion.includes(keyword.toLowerCase())) {
                detected.push(keyword);
                if (!matchedTopic) {
                    matchedTopic = topic;
                }
            }
        }
    }

    return {
        keywords: [...new Set(detected)], // Loại bỏ trùng lặp
        topic: matchedTopic
    };
};

/**
 * Lấy câu trả lời dựa trên từ khóa
 * @param {string} question - Câu hỏi của người dùng
 * @returns {object} - Câu trả lời và thông tin liên quan
 */
const getResponse = (question) => {
    const { keywords, topic } = detectKeywords(question);

    let answer, category;

    if (topic && keywordResponses[topic]) {
        const topicData = keywordResponses[topic];
        // Chọn ngẫu nhiên một câu trả lời
        const randomIndex = Math.floor(Math.random() * topicData.responses.length);
        answer = topicData.responses[randomIndex];
        category = topicData.category;
    } else {
        // Sử dụng câu trả lời mặc định
        const randomIndex = Math.floor(Math.random() * defaultResponses.length);
        answer = defaultResponses[randomIndex];
        category = 'general';
    }

    return {
        answer,
        category,
        detectedKeywords: keywords
    };
};

module.exports = {
    keywordResponses,
    defaultResponses,
    detectKeywords,
    getResponse
};
