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
// LLM (Large Language Model): Mô hình ngôn ngữ lớn.
// Khởi tạo Gemini AI
let genAI = null;
if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

// Model mặc định - sử dụng gemini-2.0-flash vì nhanh và miễn phí
const DEFAULT_MODEL = "gemini-2.0-flash";

/**
 * Tìm model khả dụng bằng cách thử từng model với prompt thực tế
 * @param {string} prompt - Prompt để test
 * @returns {Promise<string>} - Tên model khả dụng
 */
const findAvailableModel = async (prompt) => {
  // Danh sách model để thử (theo thứ tự ưu tiên - model mới nhất trước)
  const modelsToTry = [
    "gemini-2.0-flash", // Model mới nhất, miễn phí
    "gemini-1.5-flash", // Model nhanh
    "gemini-1.5-pro", // Model mạnh hơn
    "gemini-1.5-flash-latest", // Phiên bản mới nhất của flash
    "gemini-pro", // Model cũ (có thể đã deprecated)
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
 * Loại bỏ các ký tự markdown formatting từ text
 * @param {string} text - Text cần xử lý
 * @returns {string} - Text đã được làm sạch
 */
const cleanMarkdownFormatting = (text) => {
  if (!text) return text;

  return (
    text
      // Loại bỏ **bold**
      .replace(/\*\*(.*?)\*\*/g, "$1")
      // Loại bỏ *italic*
      .replace(/\*(.*?)\*/g, "$1")
      // Loại bỏ __bold__
      .replace(/__(.*?)__/g, "$1")
      // Loại bỏ _italic_
      .replace(/_(.*?)_/g, "$1")
      // Loại bỏ ~~strikethrough~~
      .replace(/~~(.*?)~~/g, "$1")
      // Loại bỏ `code`
      .replace(/`(.*?)`/g, "$1")
      // Loại bỏ ### headers
      .replace(/^#{1,6}\s+/gm, "")
      // Giữ lại bullet points nhưng chuẩn hóa
      .replace(/^[\*\-]\s+/gm, "• ")
      .trim()
  );
};

/**
 * Tạo context dữ liệu sức khỏe compact
 */
const buildHealthDataContext = (h) => {
  if (!h) return "";
  const parts = [];

  // Thông tin cơ bản - format compact
  if (h.age) parts.push(`${h.age}t`);
  if (h.gender) parts.push(h.gender);
  if (h.height) parts.push(`${h.height}cm`);
  if (h.weight) parts.push(`${h.weight}kg`);
  if (h.bmi) {
    const v = parseFloat(h.bmi);
    const s = v < 18.5 ? "thiếu" : v < 25 ? "OK" : v < 30 ? "thừa" : "béo phì";
    parts.push(`BMI:${h.bmi}(${s})`);
  }

  // Chỉ số sức khỏe
  if (h.bloodPressure?.systolic)
    parts.push(`HA:${h.bloodPressure.systolic}/${h.bloodPressure.diastolic}`);
  if (h.heartRate) parts.push(`Tim:${h.heartRate}`);
  if (h.bloodSugar) parts.push(`ĐH:${h.bloodSugar}`);
  if (h.temperature) parts.push(`${h.temperature}°C`);

  // Lối sống - chỉ thêm nếu có
  if (h.lifestyle) {
    const l = h.lifestyle;
    if (l.smoking) parts.push("hút thuốc");
    if (l.alcohol) parts.push("uống rượu");
  }

  if (h.medicalHistory) parts.push(`Bệnh:${h.medicalHistory.substring(0, 50)}`);

  return parts.length ? `\n[User: ${parts.join(", ")}]` : "";
};

/**
 * Lấy câu trả lời từ Gemini AI
 * @param {string} question - Câu hỏi của người dùng
 * @param {Array} chatHistory - Lịch sử hội thoại (tùy chọn)
 * @param {object} userHealthData - Dữ liệu sức khỏe của người dùng (tùy chọn)
 * @returns {Promise<object>} - Câu trả lời và thông tin liên quan
 */
const getGeminiResponse = async (
  question,
  chatHistory = [],
  userHealthData = null
) => {
  // Nếu không có API key, trả về lỗi
  if (!GEMINI_API_KEY || !genAI) {
    throw new Error(
      "Gemini API key chưa được cấu hình. Vui lòng thêm GEMINI_API_KEY vào file .env"
    );
  }

  // Prompt tối ưu - giảm token
  const systemPrompt = `Tư vấn sức khỏe tiếng Việt. Dùng data user nếu có. Không markdown(**). Ngắn gọn. Khuyên gặp bác sĩ nếu nghiêm trọng.`;

  // Xây dựng lịch sử hội thoại nếu có
  let fullPrompt = systemPrompt;

  // Thêm dữ liệu sức khỏe của người dùng vào context
  if (userHealthData) {
    fullPrompt += buildHealthDataContext(userHealthData);
  }

  // Chỉ lấy 3 tin nhắn gần nhất, format compact
  if (chatHistory.length > 0) {
    fullPrompt += "\nChat:";
    chatHistory.slice(-3).forEach((c) => {
      fullPrompt += `\nQ:${c.question.substring(
        0,
        100
      )}\nA:${c.answer.substring(0, 150)}`;
    });
  }

  fullPrompt += `\nQ:${question}`;

  // Thử gọi trực tiếp với model, nếu lỗi thì mới tìm model khác
  let availableModelName = getGeminiResponse._cachedModel || DEFAULT_MODEL;
  let model = genAI.getGenerativeModel({ model: availableModelName });
  let result, response, answer;

  try {
    // Gọi API Gemini trực tiếp
    result = await model.generateContent(fullPrompt);
    response = await result.response;
    answer = response.text();

    // Loại bỏ markdown formatting từ câu trả lời
    const cleanedAnswer = cleanMarkdownFormatting(answer);

    // Phát hiện category dựa trên nội dung câu trả lời
    const category = detectCategory(question, cleanedAnswer);

    // Phát hiện keywords
    const detectedKeywords = detectKeywords(question);

    return {
      answer: cleanedAnswer,
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

        // Loại bỏ markdown formatting và xử lý
        const cleanedAnswer = cleanMarkdownFormatting(answer);
        const category = detectCategory(question, cleanedAnswer);
        const detectedKeywords = detectKeywords(question);

        return {
          answer: cleanedAnswer,
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
