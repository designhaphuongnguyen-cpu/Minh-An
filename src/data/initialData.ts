import { ChildProfile, MascotInfo, MascotType, RewardItem, SkillProgressMap } from '../types';

export const MASCOTS: Record<MascotType, MascotInfo> = {
  bunny: {
    id: 'bunny',
    name: 'Thỏ Bông',
    emoji: '🐰',
    avatarBg: 'bg-rose-100 text-rose-600 border-rose-300',
    tagline: 'Bạn Thỏ Bông thích ăn cà rốt và nhảy nhót!',
    personality: 'Thỏ Bông rất thích nhảy nhót và luôn cổ vũ Minh An học giỏi!'
  },
  cat: {
    id: 'cat',
    name: 'Mèo Mimi',
    emoji: '🐱',
    avatarBg: 'bg-amber-100 text-amber-600 border-amber-300',
    tagline: 'Bạn Mèo Mimi thông minh và thích ăn cá!',
    personality: 'Mèo Mimi rất khéo léo và luôn tinh mắt tìm ra đáp án đúng!'
  },
  bear: {
    id: 'bear',
    name: 'Gấu Pooh',
    emoji: '🐻',
    avatarBg: 'bg-orange-100 text-orange-600 border-orange-300',
    tagline: 'Bạn Gấu Pooh ấm áp và thích mật ong!',
    personality: 'Gấu Pooh dũng cảm, luôn bên cạnh Minh An vượt qua mọi thử thách!'
  },
  fox: {
    id: 'fox',
    name: 'Cáo Nhanh Nhẹn',
    emoji: '🦊',
    avatarBg: 'bg-emerald-100 text-emerald-600 border-emerald-300',
    tagline: 'Bạn Cáo Nhanh Nhẹn thông thái và đáng yêu!',
    personality: 'Cáo Nhanh Nhẹn có nhiều mẹo toán học vui giúp Minh An tính siêu nhanh!'
  }
};

export const INITIAL_PROFILE: ChildProfile = {
  id: 'minh-an-01',
  name: 'Minh An',
  grade: 1,
  avatar: '👧',
  mascot: 'bunny',
  equippedAccessory: undefined,
  stars: 0,
  level: 1,
  streak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  dailyGoalStars: 5,
  soundEnabled: true,
  voiceEnabled: true,
  completedOnboarding: true,
  dailyStreakHistory: [],
  totalQuestionsSolved: 0,
  totalTimeMinutes: 0
};

export const INITIAL_SKILL_PROGRESS: SkillProgressMap = {
  counting: {
    skillId: 'counting',
    name: 'Đếm Số & Nhận Biết',
    category: 'Số học cơ bản',
    icon: '🔢',
    masteryScore: 0,
    correctCount: 0,
    wrongCount: 0,
    lastPracticed: 'Chưa học'
  },
  comparison: {
    skillId: 'comparison',
    name: 'So Sánh (>, <, =)',
    category: 'So sánh số',
    icon: '⚖️',
    masteryScore: 0,
    correctCount: 0,
    wrongCount: 0,
    lastPracticed: 'Chưa học'
  },
  addition10: {
    skillId: 'addition10',
    name: 'Phép Cộng Trong Phạm Vi 10',
    category: 'Phép tính',
    icon: '➕',
    masteryScore: 0,
    correctCount: 0,
    wrongCount: 0,
    lastPracticed: 'Chưa học'
  },
  subtraction10: {
    skillId: 'subtraction10',
    name: 'Phép Trừ Trong Phạm Vi 10',
    category: 'Phép tính',
    icon: '➖',
    masteryScore: 0,
    correctCount: 0,
    wrongCount: 0,
    lastPracticed: 'Chưa học'
  },
  wordProblems: {
    skillId: 'wordProblems',
    name: 'Bài Toán Có Lời Văn',
    category: 'Tư duy thực tế',
    icon: '📖',
    masteryScore: 0,
    correctCount: 0,
    wrongCount: 0,
    lastPracticed: 'Chưa học'
  },
  numberSequence: {
    skillId: 'numberSequence',
    name: 'Dãy Số & Điền Số Còn Thiếu',
    category: 'Quy luật',
    icon: '🚂',
    masteryScore: 0,
    correctCount: 0,
    wrongCount: 0,
    lastPracticed: 'Chưa học'
  },
  geometry: {
    skillId: 'geometry',
    name: 'Hình Học Cơ Bản',
    category: 'Hình học',
    icon: '🔷',
    masteryScore: 0,
    correctCount: 0,
    wrongCount: 0,
    lastPracticed: 'Chưa học'
  },
  measurement: {
    skillId: 'measurement',
    name: 'Đo Lường (Dài/Ngắn, Cao/Thấp)',
    category: 'Đo lường',
    icon: '📏',
    masteryScore: 0,
    correctCount: 0,
    wrongCount: 0,
    lastPracticed: 'Chưa học'
  },
  time: {
    skillId: 'time',
    name: 'Thời Gian & Xem Đồng Hồ',
    category: 'Đời sống',
    icon: '⏰',
    masteryScore: 0,
    correctCount: 0,
    wrongCount: 0,
    lastPracticed: 'Chưa học'
  },
  addition20: {
    skillId: 'addition20',
    name: 'Phép Cộng Trong Phạm Vi 20',
    category: 'Nâng cao',
    icon: '✨',
    masteryScore: 0,
    correctCount: 0,
    wrongCount: 0,
    lastPracticed: 'Chưa học'
  },
  subtraction20: {
    skillId: 'subtraction20',
    name: 'Phép Trừ Trong Phạm Vi 20',
    category: 'Nâng cao',
    icon: '🎯',
    masteryScore: 0,
    correctCount: 0,
    wrongCount: 0,
    lastPracticed: 'Chưa học'
  },
  englishLetters: {
    skillId: 'englishLetters',
    name: 'English: Chữ Cái A-Z',
    category: 'Tiếng Anh lớp 1',
    icon: '🔤',
    masteryScore: 0,
    correctCount: 0,
    wrongCount: 0,
    lastPracticed: 'Chưa học'
  },
  englishVocabulary: {
    skillId: 'englishVocabulary',
    name: 'English: Từ Vựng Quen Thuộc',
    category: 'Tiếng Anh lớp 1',
    icon: '🐱',
    masteryScore: 0,
    correctCount: 0,
    wrongCount: 0,
    lastPracticed: 'Chưa học'
  },
  englishColorsNumbers: {
    skillId: 'englishColorsNumbers',
    name: 'English: Màu Sắc & Số Đếm',
    category: 'Tiếng Anh lớp 1',
    icon: '🎨',
    masteryScore: 0,
    correctCount: 0,
    wrongCount: 0,
    lastPracticed: 'Chưa học'
  },
  vietnameseLetters: {
    skillId: 'vietnameseLetters',
    name: 'Tiếng Việt: Chữ Cái & Dấu Thanh',
    category: 'Tiếng Việt lớp 1',
    icon: '🅰️',
    masteryScore: 0,
    correctCount: 0,
    wrongCount: 0,
    lastPracticed: 'Chưa học'
  },
  vietnameseRhymes: {
    skillId: 'vietnameseRhymes',
    name: 'Tiếng Việt: Vần Đơn Giản',
    category: 'Tiếng Việt lớp 1',
    icon: '🧩',
    masteryScore: 0,
    correctCount: 0,
    wrongCount: 0,
    lastPracticed: 'Chưa học'
  },
  vietnameseReading: {
    skillId: 'vietnameseReading',
    name: 'Tiếng Việt: Đọc Hiểu Câu Ngắn',
    category: 'Tiếng Việt lớp 1',
    icon: '📖',
    masteryScore: 0,
    correctCount: 0,
    wrongCount: 0,
    lastPracticed: 'Chưa học'
  }
};

export const INITIAL_REWARDS: RewardItem[] = [
  {
    id: 'bow_pink',
    name: 'Nơ Hồng Xinh Xắn',
    category: 'bow',
    emoji: '🎀',
    cost: 5,
    unlocked: false,
    description: 'Chiếc nơ màu hồng pastel xinh xắn làm điệu cho bạn thú cưng.'
  },
  {
    id: 'crown_princess',
    name: 'Vương Miện Công Chúa',
    category: 'hat',
    emoji: '👑',
    cost: 15,
    unlocked: false,
    description: 'Vương miện vàng lấp lánh dành cho công chúa Toán học Minh An.'
  },
  {
    id: 'dress_strawberry',
    name: 'Váy Dâu Tây Ngọt Ngào',
    category: 'accessory',
    emoji: '🍓',
    cost: 20,
    unlocked: false,
    description: 'Chiếc váy dâu tây đỏ tươi cực kỳ đáng yêu.'
  },
  {
    id: 'pet_kitty',
    name: 'Bạn Mèo Mimi Nhỏ',
    category: 'pet',
    emoji: '🐱',
    cost: 30,
    unlocked: false,
    description: 'Chú mèo con kêu meo meo theo Minh An khắp mọi nơi.'
  },
  {
    id: 'rainbow_magic',
    name: 'Cầu Vồng Lấp Lánh',
    category: 'sticker',
    emoji: '🌈',
    cost: 20,
    unlocked: false,
    description: 'Cầu vồng 7 sắc rực rỡ mang lại nhiều điều may mắn.'
  },
  {
    id: 'magic_wand',
    name: 'Đũa Phép Ngôi Sao',
    category: 'accessory',
    emoji: '🪄',
    cost: 25,
    unlocked: false,
    description: 'Đũa phép lấp lánh ban phép thuật biến mọi bài toán thành niềm vui.'
  },
  {
    id: 'cupcake_sweet',
    name: 'Bánh Kem Ngọt Ngào',
    category: 'sticker',
    emoji: '🧁',
    cost: 10,
    unlocked: false,
    description: 'Chiếc bánh cupcake kem vani và dâu tây thơm phức.'
  },
  {
    id: 'golden_trophy',
    name: 'Cúp Vô Địch Toán Học',
    category: 'badge',
    emoji: '🏆',
    cost: 40,
    unlocked: false,
    description: 'Biểu tượng của học sinh xuất sắc chăm chỉ giải toán mỗi ngày.'
  },
  {
    id: 'unicorn_dream',
    name: 'Kỳ Lân Mộng Mơ',
    category: 'sticker',
    emoji: '🦄',
    cost: 35,
    unlocked: false,
    description: 'Chú kỳ lân màu tím pastel tuyệt đẹp.'
  },
  {
    id: 'carrot_basket',
    name: 'Giỏ Cà Rốt Vàng',
    category: 'accessory',
    emoji: '🥕',
    cost: 15,
    unlocked: false,
    description: 'Món quà đặc biệt dành tặng bạn Thỏ Bông.'
  }
];

export const STICKER_COLLECTION = [
  { id: 'st_star', name: 'Ngôi Sao Sáng', emoji: '⭐', description: 'Đạt điểm tuyệt đối trong bài học', unlocked: false },
  { id: 'st_rainbow', name: 'Cầu Vồng Vui Vẻ', emoji: '🌈', description: 'Hoàn thành 3 ngày liên tiếp', unlocked: false },
  { id: 'st_unicorn', name: 'Kỳ Lân Kỳ Diệu', emoji: '🦄', description: 'Đạt 25 sao tích lũy', unlocked: false },
  { id: 'st_bunny', name: 'Thỏ Bông Nhảy Nhót', emoji: '🐰', description: 'Giúp Thỏ tìm được cà rốt', unlocked: false },
  { id: 'st_cat', name: 'Mèo Mimi Khéo Léo', emoji: '🐱', description: 'Làm đúng 5 câu phép cộng', unlocked: false },
  { id: 'st_flower', name: 'Hoa Anh Đào', emoji: '🌸', description: 'Bắt đầu tuần học mới', unlocked: false },
  { id: 'st_trophy', name: 'Cúp Chiến Thắng', emoji: '🏆', description: 'Hoàn thành Thử thách hôm nay', unlocked: false },
  { id: 'st_strawberry', name: 'Dâu Tây Ngọt', emoji: '🍓', description: 'Trả lời đúng 10 câu liên tiếp', unlocked: false },
  { id: 'st_train', name: 'Đoàn Tàu Số', emoji: '🚂', description: 'Chiến thắng trò chơi Đoàn tàu', unlocked: false },
  { id: 'st_balloon', name: 'Bóng Bay Rực Rỡ', emoji: '🎈', description: 'Bắn trúng 10 quả bóng toán', unlocked: false },
  { id: 'st_candy', name: 'Kẹo Ngọt Đáng Yêu', emoji: '🍬', description: 'Đến cửa hàng toán học', unlocked: false },
  { id: 'st_clock', name: 'Đồng Hồ Chăm Chỉ', emoji: '⏰', description: 'Học đúng giờ mỗi ngày', unlocked: false }
];
