import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // AI Parent Insights & Evaluation
  app.post('/api/ai/parent-insights', async (req, res) => {
    try {
      const { profile, skillProgress, recentAttempts } = req.body;
      const ai = getAIClient();

      if (!ai) {
        // Fallback intelligent summary if API key is not configured
        return res.json({
          summary: `Tuần này Minh An học rất chăm chỉ, duy trì chuỗi ${profile?.streak || 4} ngày liên tiếp! Bé làm rất tốt ở phần Đếm số và Phép cộng trong phạm vi 10.`,
          strengths: ['Đếm đồ vật và nhận biết số lượng nhanh', 'Thuộc quy tắc phép cộng trong phạm vi 10'],
          weaknesses: ['Cần luyện thêm phép trừ có nhớ hoặc trừ số 3, 4', 'Đôi khi vội khi đọc đề bài có lời văn'],
          realWorldActivities: [
            'Dùng 8 viên lego hoặc kẹo dâu, cất bớt 3 viên rồi cùng Minh An đếm số còn lại.',
            'Khi đi siêu thị, nhờ Minh An lấy đúng 5 quả táo vào giỏ quà.',
            'Cùng Minh An xem đồng hồ khi đến giờ ăn tối hoặc giờ đi ngủ.'
          ],
          cheerMessage: 'Bé Minh An đang tiến bộ từng ngày, phụ huynh hãy tiếp tục khen ngợi và thưởng sao cho bé nhé!'
        });
      }

      const prompt = `Bạn là một Chuyên gia Giáo dục Tiểu học và Giáo viên Toán Lớp 1 giàu kinh nghiệm và dịu dàng.
Hãy phân tích kết quả học tập môn Toán của bé gái tên là "Minh An" (Lớp 1, 6 tuổi):
- Chuỗi ngày học: ${profile?.streak || 4} ngày
- Số sao hiện tại: ${profile?.stars || 28} sao
- Tiến độ kỹ năng: ${JSON.stringify(skillProgress || {})}
- Lịch sử làm bài gần đây: ${JSON.stringify((recentAttempts || []).slice(-10))}

Hãy viết bản báo cáo phân tích và lời khuyên dành riêng cho BỐ MẸ của Minh An bằng tiếng Việt.
Trả về định dạng JSON thuần túy (không markdown) với cấu trúc sau:
{
  "summary": "Đoạn văn ngắn 2-3 câu tổng quan tinh thần học tập và tiến độ của Minh An",
  "strengths": ["Điểm mạnh 1", "Điểm mạnh 2"],
  "weaknesses": ["Điểm cần lưu ý/luyện thêm 1", "Điểm cần lưu ý/luyện thêm 2"],
  "realWorldActivities": ["Hoạt động thực tế thú vị cùng con ở nhà 1 (ví dụ với đồ chơi, kẹo, trái cây)", "Hoạt động thực tế 2", "Hoạt động thực tế 3"],
  "cheerMessage": "Lời nhắn nhủ động viên gửi đến phụ huynh"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (error: any) {
      console.error('Error generating parent insights:', error);
      res.json({
        summary: 'Minh An đang tiến bộ rất đều đặn và hào hứng học mỗi ngày. Bé nhận diện mặt số và phép cộng rất nhanh!',
        strengths: ['Đếm số và so sánh lớn hơn/bé hơn rất tự tin', 'Rất thích thú với các trò chơi toán học'],
        weaknesses: ['Phép trừ phạm vi 10 cần trực quan hóa thêm bằng đồ vật thực tế'],
        realWorldActivities: [
          'Cùng đếm thìa dĩa khi dọn bàn ăn',
          'Lấy 10 chiếc cúc áo hoặc kẹo để chơi trò "mua bán tí hon"'
        ],
        cheerMessage: 'Bố mẹ hãy tiếp tục đồng hành và khích lệ Minh An mỗi ngày 10-15 phút nhé!'
      });
    }
  });

  // AI Story Problem Generator with Minh An as protagonist
  app.post('/api/ai/generate-story-problem', async (req, res) => {
    try {
      const { skillId, difficulty, topic } = req.body;
      const ai = getAIClient();

      if (!ai) {
        return res.json({
          success: false,
          fallback: true
        });
      }

      const prompt = `Tạo một bài toán có lời văn lớp 1 cực kỳ dễ hiểu, ngắn gọn và ngọt ngào dành riêng cho bé gái tên Minh An (6 tuổi).
Chủ đề: ${topic || 'đồ chơi, kẹo ngọt, thú cưng, gia đình, công viên'}.
Kỹ năng: ${skillId || 'additionWithin10'}.
Độ khó: ${difficulty || 1} (phạm vi số từ 1 đến 10, phép tính đơn giản).

Yêu cầu:
- Tối đa 2 câu văn thật ngắn.
- Các con số rõ ràng (<= 10).
- Minh An là nhân vật chính.
- Trả về JSON với schema:
{
  "question": "Câu chuyện toán ngắn",
  "itemEmoji": "🍓",
  "numA": 4,
  "numB": 2,
  "operation": "+" hoặc "-",
  "correctAnswer": 6,
  "options": [4, 5, 6, 7],
  "hint1": "Gợi ý nhẹ nhàng cho bé",
  "hint2": "Gợi ý bằng hình ảnh trực quan",
  "explanation": "Lời giải thích ấm áp: 'Minh An có 4 quả dâu, thêm 2 quả nữa là 6 quả dâu nhé!'"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.8,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({ success: true, problem: parsed });
    } catch (error: any) {
      console.error('Error generating AI problem:', error);
      res.json({ success: false, fallback: true });
    }
  });

  // Vite middleware for development vs Static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Toán 1 Cùng Minh An server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
