/**
 * ===================================
 * SERVICE: GEMINI AI - TƯ VẤN SỨC KHỎE
 * ===================================
 * Service này tích hợp Google Gemini API để trả lời
 * các câu hỏi về sức khỏe một cách thông minh
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Lấy API key từ biến môi trường
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn(
    "⚠️  Cảnh báo: GEMINI_API_KEY chưa được cấu hình trong file .env"
  );
}

// Khởi tạo Gemini AI
let genAI = null;
if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

/**
 * Tìm model khả dụng bằng cách thử từng model với prompt thực tế
 * @param {string} prompt - Prompt để test
 * @returns {Promise<string>} - Tên model khả dụng
 */
const findAvailableModel = async (prompt) => {
  // Danh sách model để thử (theo thứ tự ưu tiên)
  // Thử các biến thể tên model khác nhau
  const modelsToTry = [
    "gemini-pro", // Tên cơ bản
    "models/gemini-pro", // Với prefix models/
    "gemini-1.5-flash", // Model mới
    "models/gemini-1.5-flash", // Với prefix
    "gemini-1.5-pro", // Model mới
    "models/gemini-1.5-pro", // Với prefix
    "gemini-1.0-pro", // Phiên bản cũ hơn
    "models/gemini-1.0-pro", // Với prefix
  ];

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      // Test với prompt thực tế
      const testResult = await model.generateContent(prompt);
      const testResponse = await testResult.response;
      const testAnswer = testResponse.text(); // Đảm bảo có thể lấy text

      console.log(`✅ Tìm thấy model khả dụng: ${modelName}`);
      return modelName;
    } catch (error) {
      // Model không khả dụng, thử model tiếp theo
      const errorMsg = error.message || error.toString();
      if (!errorMsg.includes("not found") && !errorMsg.includes("404")) {
        // Nếu không phải lỗi 404, có thể là lỗi khác, log để debug
        console.log(
          `⚠️  Model ${modelName} lỗi: ${errorMsg.substring(0, 100)}`
        );
      }
      continue;
    }
  }

  throw new Error(
    "Không tìm thấy model Gemini khả dụng. Vui lòng kiểm tra lại API key hoặc thử lại sau."
  );
};

/**
 * Lấy câu trả lời từ Gemini AI
 * @param {string} question - Câu hỏi của người dùng
 * @param {Array} chatHistory - Lịch sử hội thoại (tùy chọn)
 * @returns {Promise<object>} - Câu trả lời và thông tin liên quan
 */
const getGeminiResponse = async (question, chatHistory = []) => {
  // Nếu không có API key, trả về lỗi
  if (!GEMINI_API_KEY || !genAI) {
    throw new Error(
      "Gemini API key chưa được cấu hình. Vui lòng thêm GEMINI_API_KEY vào file .env"
    );
  }

  // Tạo prompt với context về tư vấn sức khỏe
  const systemPrompt = `Bạn là một chatbot tư vấn sức khỏe chuyên nghiệp và thân thiện. 
Nhiệm vụ của bạn là:
- Trả lời các câu hỏi về sức khỏe một cách chính xác và hữu ích
- Đưa ra lời khuyên về lối sống lành mạnh, dinh dưỡng, tập thể dục, giấc ngủ, stress
- Luôn nhắc nhở người dùng tham khảo ý kiến bác sĩ nếu có vấn đề sức khỏe nghiêm trọng
- Trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu
- Sử dụng định dạng danh sách hoặc số thứ tự khi phù hợp
- Không đưa ra chẩn đoán y khoa chính xác, chỉ tư vấn chung

Hãy trả lời câu hỏi sau:`;

  // Xây dựng lịch sử hội thoại nếu có
  let fullPrompt = systemPrompt;

  if (chatHistory.length > 0) {
    fullPrompt += "\n\nLịch sử hội thoại trước đó:\n";
    chatHistory.slice(-5).forEach((chat, index) => {
      fullPrompt += `Người dùng: ${chat.question}\n`;
      fullPrompt += `Bạn: ${chat.answer}\n\n`;
    });
  }

  fullPrompt += `\nCâu hỏi hiện tại: ${question}`;

  // Thử gọi trực tiếp với model, nếu lỗi thì mới tìm model khác
  let availableModelName = getGeminiResponse._cachedModel || "gemini-pro";
  let model = genAI.getGenerativeModel({ model: availableModelName });
  let result, response, answer;

  try {
    // Gọi API Gemini trực tiếp
    result = await model.generateContent(fullPrompt);
    response = await result.response;
    answer = response.text();

    // Phát hiện category dựa trên nội dung câu trả lời
    const category = detectCategory(question, answer);

    // Phát hiện keywords
    const detectedKeywords = detectKeywords(question);

    return {
      answer: answer.trim(),
      category,
      detectedKeywords,
    };
  } catch (error) {
    console.error("Lỗi khi gọi Gemini API:", error);

    // Nếu model không tìm thấy, xóa cache và tìm model mới
    if (
      error.message &&
      (error.message.includes("not found") ||
        error.message.includes("404") ||
        error.message.includes("is not found"))
    ) {
      console.log("Model không khả dụng, đang tìm model mới...");
      getGeminiResponse._cachedModel = null; // Xóa cache

      try {
        // Tìm model khả dụng với prompt thực tế
        availableModelName = await findAvailableModel(fullPrompt);
        getGeminiResponse._cachedModel = availableModelName;

        // Thử lại với model mới
        model = genAI.getGenerativeModel({ model: availableModelName });
        result = await model.generateContent(fullPrompt);
        response = await result.response;
        answer = response.text();

        // Nếu thành công, xử lý và return
        const category = detectCategory(question, answer);
        const detectedKeywords = detectKeywords(question);

        return {
          answer: answer.trim(),
          category,
          detectedKeywords,
        };
      } catch (retryError) {
        console.error("Lỗi khi thử lại với model mới:", retryError);
        throw new Error(
          "Không thể kết nối với dịch vụ Gemini. Vui lòng kiểm tra lại API key hoặc thử lại sau."
        );
      }
    }

    // Xử lý các lỗi khác
    const errorMessage = error.message || error.toString();
    if (
      errorMessage.includes("API key") ||
      errorMessage.includes("401") ||
      errorMessage.includes("403")
    ) {
      throw new Error(
        "Lỗi cấu hình API. Vui lòng kiểm tra lại GEMINI_API_KEY trong file .env"
      );
    } else if (
      errorMessage.includes("quota") ||
      errorMessage.includes("limit") ||
      errorMessage.includes("429")
    ) {
      throw new Error("Đã vượt quá giới hạn API. Vui lòng thử lại sau.");
    } else {
      throw new Error(
        "Không thể kết nối với dịch vụ tư vấn. Vui lòng thử lại sau."
      );
    }
  }
};

/**
 * Phát hiện category từ câu hỏi và câu trả lời
 * @param {string} question - Câu hỏi
 * @param {string} answer - Câu trả lời
 * @returns {string} - Category
 */
const detectCategory = (question, answer) => {
  const lowerQuestion = question.toLowerCase();
  const lowerAnswer = answer.toLowerCase();

  if (
    lowerQuestion.includes("stress") ||
    lowerQuestion.includes("căng thẳng") ||
    lowerQuestion.includes("lo lắng") ||
    lowerQuestion.includes("áp lực")
  ) {
    return "stress";
  }
  if (
    lowerQuestion.includes("ngủ") ||
    lowerQuestion.includes("mất ngủ") ||
    lowerQuestion.includes("khó ngủ") ||
    lowerQuestion.includes("giấc ngủ")
  ) {
    return "sleep";
  }
  if (
    lowerQuestion.includes("ăn") ||
    lowerQuestion.includes("dinh dưỡng") ||
    lowerQuestion.includes("thức ăn") ||
    lowerQuestion.includes("chế độ ăn") ||
    lowerQuestion.includes("giảm cân") ||
    lowerQuestion.includes("tăng cân")
  ) {
    return "nutrition";
  }
  if (
    lowerQuestion.includes("tập") ||
    lowerQuestion.includes("thể dục") ||
    lowerQuestion.includes("vận động") ||
    lowerQuestion.includes("gym")
  ) {
    return "exercise";
  }
  if (
    lowerQuestion.includes("đau") ||
    lowerQuestion.includes("bệnh") ||
    lowerQuestion.includes("triệu chứng") ||
    lowerQuestion.includes("cảm") ||
    lowerQuestion.includes("cúm") ||
    lowerQuestion.includes("sốt")
  ) {
    return "disease";
  }

  return "general";
};

/**
 * Phát hiện keywords trong câu hỏi
 * @param {string} question - Câu hỏi
 * @returns {Array<string>} - Danh sách keywords
 */
const detectKeywords = (question) => {
  const keywords = [];
  const lowerQuestion = question.toLowerCase();

  const keywordList = [
    "stress",
    "căng thẳng",
    "lo lắng",
    "áp lực",
    "ngủ",
    "mất ngủ",
    "khó ngủ",
    "giấc ngủ",
    "ăn",
    "dinh dưỡng",
    "thức ăn",
    "chế độ ăn",
    "giảm cân",
    "tăng cân",
    "tập",
    "thể dục",
    "vận động",
    "gym",
    "đau",
    "bệnh",
    "triệu chứng",
    "cảm",
    "cúm",
    "sốt",
    "nước",
    "uống nước",
    "khát",
    "thuốc",
    "uống thuốc",
  ];

  keywordList.forEach((keyword) => {
    if (lowerQuestion.includes(keyword.toLowerCase())) {
      keywords.push(keyword);
    }
  });

  return [...new Set(keywords)]; // Loại bỏ trùng lặp
};

module.exports = {
  getGeminiResponse,
};
