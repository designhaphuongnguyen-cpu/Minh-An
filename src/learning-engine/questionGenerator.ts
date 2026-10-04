import { Question, SkillId } from '../types';

// Diverse cute visual item sets for Minh An
const CUTE_ITEMS = ['🍓', '🍎', '🧁', '⭐', '🌸', '🥕', '🐱', '🍬', '🎈', '🍪', '🎀', '🧸', '🐣', '🦋'];

const CONTEXT_THEMES = [
  { item: 'quả dâu tây ngọt lịm', emoji: '🍓' },
  { item: 'chiếc kẹo bông thơm ngon', emoji: '🍬' },
  { item: 'bông hoa cúc xinh xắn', emoji: '🌸' },
  { item: 'củ cà rốt giòn ngọt', emoji: '🥕' },
  { item: 'chiếc bánh quy bơ giòn rụm', emoji: '🍪' },
  { item: 'chiếc bút sáp màu rực rỡ', emoji: '🖍️' },
  { item: 'ngôi sao may mắn', emoji: '⭐' }
];

export function generateQuestion(skillId: SkillId, difficulty: 1 | 2 | 3 = 1): Question {
  const id = `q_${skillId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  switch (skillId) {
    case 'counting':
      return generateCountingQuestion(id, difficulty);
    case 'comparison':
      return generateComparisonQuestion(id, difficulty);
    case 'addition10':
      return generateAddition10Question(id, difficulty);
    case 'addition20':
      return generateAddition20Question(id, difficulty);
    case 'subtraction10':
      return generateSubtraction10Question(id, difficulty);
    case 'subtraction20':
      return generateSubtraction20Question(id, difficulty);
    case 'numberSequence':
      return generateSequenceQuestion(id, difficulty);
    case 'geometry':
      return generateGeometryQuestion(id, difficulty);
    case 'measurement':
      return generateMeasurementQuestion(id, difficulty);
    case 'time':
      return generateTimeQuestion(id, difficulty);
    case 'wordProblems':
      return generateWordProblemQuestion(id, difficulty);
    case 'englishLetters':
      return generateEnglishLetterQuestion(id, difficulty);
    case 'englishVocabulary':
      return generateEnglishVocabularyQuestion(id, difficulty);
    case 'englishColorsNumbers':
      return generateEnglishColorsNumbersQuestion(id, difficulty);
    case 'vietnameseLetters':
      return generateVietnameseLetterQuestion(id, difficulty);
    case 'vietnameseRhymes':
      return generateVietnameseRhymeQuestion(id, difficulty);
    case 'vietnameseReading':
      return generateVietnameseReadingQuestion(id, difficulty);
    default:
      return generateCountingQuestion(id, difficulty);
  }
}

// 1. Đếm số & Nhận biết
function generateCountingQuestion(id: string, difficulty: number): Question {
  const emoji = CUTE_ITEMS[Math.floor(Math.random() * CUTE_ITEMS.length)];
  const max = difficulty === 1 ? 7 : difficulty === 2 ? 10 : 15;
  const min = difficulty === 1 ? 2 : 5;
  const count = Math.floor(Math.random() * (max - min + 1)) + min;

  const items = Array.from({ length: count }, () => emoji);
  const options = generateNumberOptions(count, 1, max + 2);

  const isPredecessorSuccessor = difficulty >= 2 && Math.random() > 0.6;
  if (isPredecessorSuccessor) {
    const isAfter = Math.random() > 0.5;
    const base = Math.floor(Math.random() * 8) + 1;
    const answer = isAfter ? base + 1 : base - 1;
    const text = isAfter
      ? `Số liền sau của số ${base} là số mấy nhỉ Minh An?`
      : `Số liền trước của số ${base} là số mấy nhỉ Minh An?`;

    return {
      id,
      skillId: 'counting',
      title: isAfter ? 'Số liền sau' : 'Số liền trước',
      questionText: text,
      visualType: 'sequence-train',
      visualData: {
        sequence: isAfter ? [base, '?'] : ['?', base],
        emoji: '🔢'
      },
      options: generateNumberOptions(answer, 0, 10),
      correctAnswer: answer,
      hint1: isAfter ? `Con đếm tiếp từ ${base} thêm 1 nhé!` : `Con đếm lùi từ ${base} bớt 1 nhé!`,
      hint2: `Dãy số: ${base - 1 >= 0 ? base - 1 : 0}, ${base}, ${base + 1}`,
      hint3: isAfter ? `Số liền sau của ${base} là ${base + 1}.` : `Số liền trước của ${base} là ${base - 1}.`,
      explanation: `Đúng rồi! Số liền ${isAfter ? 'sau' : 'trước'} của ${base} chính là ${answer}.`,
      difficulty: difficulty as 1 | 2 | 3
    };
  }

  return {
    id,
    skillId: 'counting',
    title: 'Đếm số lượng',
    questionText: `Minh An đếm xem có tất cả bao nhiêu ${emoji} nhé?`,
    visualType: 'item-count',
    visualData: {
      itemsA: items,
      countA: count,
      emoji
    },
    options,
    correctAnswer: count,
    hint1: `Minh An chỉ ngón tay vào từng ${emoji} và đếm từ 1 nha!`,
    hint2: `Các ${emoji} được xếp ngay ngắn, con đếm theo hàng từ trái qua phải nhé!`,
    hint3: `Có tất cả ${count} ${emoji}.`,
    explanation: `Giỏi quá Minh An! Có đúng ${count} ${emoji}.`,
    difficulty: difficulty as 1 | 2 | 3
  };
}

// 2. So sánh (>, <, =)
function generateComparisonQuestion(id: string, difficulty: number): Question {
  const max = difficulty === 1 ? 7 : 10;
  const numA = Math.floor(Math.random() * max) + 1;
  let numB = Math.floor(Math.random() * max) + 1;

  // Sometimes equal
  if (Math.random() < 0.25) {
    numB = numA;
  }

  const emojiA = '🌸';
  const emojiB = '⭐';

  let correctSign: '>' | '<' | '=';
  if (numA > numB) correctSign = '>';
  else if (numA < numB) correctSign = '<';
  else correctSign = '=';

  return {
    id,
    skillId: 'comparison',
    title: 'So sánh số lượng',
    questionText: `Minh An điền dấu thích hợp vào ô trống nhé: ${numA} ... ${numB}`,
    visualType: 'comparison-balance',
    visualData: {
      countA: numA,
      countB: numB,
      itemsA: Array(numA).fill(emojiA),
      itemsB: Array(numB).fill(emojiB),
      operator: '?'
    },
    options: ['>', '<', '='],
    correctAnswer: correctSign,
    hint1: `Bên trái có ${numA} bạn, bên phải có ${numB} bạn. Bên nào nhiều hơn nhỉ?`,
    hint2: `Miệng dấu lớn luôn mở to về phía số lớn hơn đó Minh An!`,
    hint3: numA === numB ? `Vì ${numA} bằng ${numB} nên ta chọn dấu =` : `${numA} ${correctSign} ${numB}`,
    explanation: `Chính xác! ${numA} ${correctSign} ${numB}. Minh An tinh mắt lắm!`,
    difficulty: difficulty as 1 | 2 | 3
  };
}

// 3. Phép cộng trong phạm vi 10
function generateAddition10Question(id: string, difficulty: number): Question {
  const numA = Math.floor(Math.random() * 5) + 1; // 1 to 5
  const numB = Math.floor(Math.random() * (10 - numA)) + 1; // sum <= 10
  const sum = numA + numB;
  const emoji = CUTE_ITEMS[Math.floor(Math.random() * CUTE_ITEMS.length)];

  // Fill in the missing number style
  const isMissingAddend = difficulty >= 2 && Math.random() > 0.5;

  if (isMissingAddend) {
    return {
      id,
      skillId: 'addition10',
      title: 'Điền số còn thiếu',
      questionText: `Điền số thích hợp vào dấu hỏi chấm: ${numA} + ? = ${sum}`,
      visualType: 'item-addition',
      visualData: {
        countA: numA,
        countB: numB,
        itemsA: Array(numA).fill(emoji),
        itemsB: Array(numB).fill('❓'),
        operator: '+',
        emoji
      },
      options: generateNumberOptions(numB, 1, 10),
      correctAnswer: numB,
      hint1: `Con có ${numA} ${emoji}, cần thêm mấy ${emoji} nữa để được ${sum} nhỉ?`,
      hint2: `Con hãy đếm tiếp từ ${numA} lên đến ${sum} xem thêm mấy ngón tay nhé!`,
      hint3: `${sum} trừ ${numA} bằng ${numB}. Vậy số cần điền là ${numB}.`,
      explanation: `Tuyệt vời! ${numA} + ${numB} = ${sum}. Minh An làm rất chuẩn!`,
      difficulty: difficulty as 1 | 2 | 3
    };
  }

  return {
    id,
    skillId: 'addition10',
    title: 'Phép cộng trực quan',
    questionText: `${numA} + ${numB} = ?`,
    visualType: 'item-addition',
    visualData: {
      countA: numA,
      countB: numB,
      itemsA: Array(numA).fill(emoji),
      itemsB: Array(numB).fill(emoji),
      operator: '+',
      emoji
    },
    options: generateNumberOptions(sum, 1, 10),
    correctAnswer: sum,
    hint1: `Bên trái có ${numA} ${emoji}, bên phải thêm ${numB} ${emoji}.`,
    hint2: `Minh An gộp tất cả lại rồi đếm từ 1 đến hết nhé!`,
    hint3: `${numA} cộng ${numB} bằng ${sum}.`,
    explanation: `Đúng rồi Minh An! ${numA} + ${numB} = ${sum}.`,
    difficulty: difficulty as 1 | 2 | 3
  };
}

// 4. Phép cộng trong phạm vi 20
function generateAddition20Question(id: string, difficulty: number): Question {
  const numA = Math.floor(Math.random() * 6) + 7; // 7 to 12
  const numB = Math.floor(Math.random() * (20 - numA)) + 1; // sum <= 20
  const sum = numA + numB;
  const emoji = '🍬';

  return {
    id,
    skillId: 'addition20',
    title: 'Cộng phạm vi 20',
    questionText: `${numA} + ${numB} = ?`,
    visualType: 'item-addition',
    visualData: {
      countA: numA,
      countB: numB,
      itemsA: Array(numA).fill(emoji),
      itemsB: Array(numB).fill(emoji),
      operator: '+',
      emoji
    },
    options: generateNumberOptions(sum, 5, 20),
    correctAnswer: sum,
    hint1: `Con giữ số lớn là ${numA} trong đầu, rồi đếm thêm ${numB} nhé!`,
    hint2: `Đếm thêm: ${numA}... ${numA + 1}, ${numA + 2}...`,
    hint3: `${numA} + ${numB} = ${sum}.`,
    explanation: `Giỏi lắm Minh An! ${numA} + ${numB} = ${sum}.`,
    difficulty: difficulty as 1 | 2 | 3
  };
}

// 5. Phép trừ trong phạm vi 10
function generateSubtraction10Question(id: string, difficulty: number): Question {
  const total = Math.floor(Math.random() * 7) + 3; // 3 to 9
  const sub = Math.floor(Math.random() * (total - 1)) + 1; // 1 to total-1
  const remain = total - sub;
  const emoji = CUTE_ITEMS[Math.floor(Math.random() * CUTE_ITEMS.length)];

  // Fill in missing
  const isMissing = difficulty >= 2 && Math.random() > 0.6;
  if (isMissing) {
    return {
      id,
      skillId: 'subtraction10',
      title: 'Điền số còn thiếu',
      questionText: `${total} - ? = ${remain}`,
      visualType: 'item-subtraction',
      visualData: {
        countA: total,
        subtractedCount: sub,
        itemsA: Array(total).fill(emoji),
        operator: '-',
        emoji
      },
      options: generateNumberOptions(sub, 1, total),
      correctAnswer: sub,
      hint1: `Có tất cả ${total} ${emoji}, bớt đi mấy cái để còn lại ${remain} ${emoji} nhỉ?`,
      hint2: `Con thử đếm số ${emoji} bị gạch chéo nhé!`,
      hint3: `${total} bớt đi ${sub} thì còn ${remain}.`,
      explanation: `Chuẩn luôn Minh An ơi! ${total} - ${sub} = ${remain}.`,
      difficulty: difficulty as 1 | 2 | 3
    };
  }

  return {
    id,
    skillId: 'subtraction10',
    title: 'Phép trừ trực quan',
    questionText: `${total} - ${sub} = ?`,
    visualType: 'item-subtraction',
    visualData: {
      countA: total,
      subtractedCount: sub,
      itemsA: Array(total).fill(emoji),
      operator: '-',
      emoji
    },
    options: generateNumberOptions(remain, 0, 10),
    correctAnswer: remain,
    hint1: `Có ${total} ${emoji}, con bớt đi ${sub} ${emoji} bị gạch chéo nhé!`,
    hint2: `Minh An chỉ đếm những ${emoji} còn lại chưa bị gạch thôi nha!`,
    hint3: `Lấy ${total} bớt đi ${sub} còn lại ${remain}.`,
    explanation: `Đúng rồi Minh An! ${total} - ${sub} = ${remain}. Bé làm rất tốt!`,
    difficulty: difficulty as 1 | 2 | 3
  };
}

// 6. Phép trừ trong phạm vi 20
function generateSubtraction20Question(id: string, difficulty: number): Question {
  const total = Math.floor(Math.random() * 8) + 11; // 11 to 18
  const sub = Math.floor(Math.random() * 8) + 2; // 2 to 9
  const remain = total - sub;
  const emoji = '🍓';

  return {
    id,
    skillId: 'subtraction20',
    title: 'Trừ phạm vi 20',
    questionText: `${total} - ${sub} = ?`,
    visualType: 'item-subtraction',
    visualData: {
      countA: total,
      subtractedCount: sub,
      itemsA: Array(total).fill(emoji),
      operator: '-',
      emoji
    },
    options: generateNumberOptions(remain, 1, 19),
    correctAnswer: remain,
    hint1: `Con có thể đếm lùi ${sub} bước từ số ${total} nhé!`,
    hint2: `Đếm lùi: ${total - 1}, ${total - 2}...`,
    hint3: `${total} trừ ${sub} bằng ${remain}.`,
    explanation: `Tuyệt đỉnh! ${total} - ${sub} = ${remain}.`,
    difficulty: difficulty as 1 | 2 | 3
  };
}

// 7. Dãy số & Điền vào đoàn tàu
function generateSequenceQuestion(id: string, difficulty: number): Question {
  const start = Math.floor(Math.random() * 5) + 1;
  const isAscending = difficulty < 3 || Math.random() > 0.3;
  const step = 1;
  const length = 5;

  const fullSeq: number[] = [];
  for (let i = 0; i < length; i++) {
    fullSeq.push(isAscending ? start + i * step : start + (length - 1 - i) * step);
  }

  const missingIndex = Math.floor(Math.random() * (length - 2)) + 1; // Index 1, 2, or 3
  const correctAnswer = fullSeq[missingIndex];

  const displaySeq: (number | string | null)[] = fullSeq.map((num, idx) =>
    idx === missingIndex ? '?' : num
  );

  return {
    id,
    skillId: 'numberSequence',
    title: 'Đoàn tàu dãy số',
    questionText: `Minh An giúp đoàn tàu tìm toa số còn thiếu nhé: ${displaySeq.join(' – ')}`,
    visualType: 'sequence-train',
    visualData: {
      sequence: displaySeq,
      emoji: '🚂'
    },
    options: generateNumberOptions(correctAnswer, Math.max(0, correctAnswer - 3), correctAnswer + 3),
    correctAnswer,
    hint1: `Minh An đếm xuôi từ số ${fullSeq[0]} xem số tiếp theo là gì nha!`,
    hint2: `Sau số ${fullSeq[missingIndex - 1]} sẽ là số mấy nhỉ?`,
    hint3: `Số thích hợp điền vào dấu ? là ${correctAnswer}.`,
    explanation: `Hoan hô Minh An! Toa tàu số ${correctAnswer} đã vào đúng vị trí!`,
    difficulty: difficulty as 1 | 2 | 3
  };
}

// 8. Hình học cơ bản
function generateGeometryQuestion(id: string, difficulty: number): Question {
  const shapes = [
    { name: 'Hình tròn', icon: '🔴', realLife: 'chiếc đồng hồ treo tường hoặc bánh quy tròn' },
    { name: 'Hình vuông', icon: '🟦', realLife: 'hộp quà sinh nhật hoặc viên gạch bông' },
    { name: 'Hình tam giác', icon: '🔺', realLife: 'miếng dưa hấu hoặc mái nhà' },
    { name: 'Hình chữ nhật', icon: '🟩', realLife: 'chiếc bảng đen hoặc cánh cửa' }
  ];

  const target = shapes[Math.floor(Math.random() * shapes.length)];
  const otherShapes = shapes.filter((s) => s.name !== target.name);

  return {
    id,
    skillId: 'geometry',
    title: 'Nhận biết hình học',
    questionText: `Đâu là **${target.name}** (${target.realLife}) hả Minh An?`,
    visualType: 'shape-match',
    visualData: {
      targetShape: target.name,
      emoji: target.icon
    },
    options: [target.name, ...otherShapes.map((s) => s.name)].sort(() => 0.5 - Math.random()),
    correctAnswer: target.name,
    hint1: `Hãy nhìn kỹ các cạnh và góc của hình nhé!`,
    hint2: target.name === 'Hình tròn' ? 'Hình tròn không có góc cạnh nào, tròn xoe!' : `Hình này có các cạnh thẳng rất đẹp!`,
    hint3: `Hình có biểu tượng ${target.icon} chính là ${target.name}.`,
    explanation: `Chính xác! ${target.name} ${target.icon} rất dễ nhận ra đúng không Minh An!`,
    difficulty: difficulty as 1 | 2 | 3
  };
}

// 9. Đo lường (Dài/Ngắn, Cao/Thấp)
function generateMeasurementQuestion(id: string, difficulty: number): Question {
  const types = [
    { question: 'Chiếc bút chì nào DÀI HƠN?', optionA: '✏️ Bút chì dài', optionB: '🖍️ Bút chì ngắn', correct: '✏️ Bút chì dài' },
    { question: 'Chiếc thước kẻ nào NGẮN HƠN?', optionA: '📏 Thước dài', optionB: '📐 Thước ngắn', correct: '📐 Thước ngắn' },
    { question: 'Bạn nào CAO HƠN?', optionA: '🦒 Bạn Hươu cao cổ', optionB: '🐰 Bạn Thỏ nhỏ', correct: '🦒 Bạn Hươu cao cổ' },
    { question: 'Đồ vật nào THẤP HƠN?', optionA: '🌳 Cái cây to', optionB: '🍄 Cây nấm nhỏ', correct: '🍄 Cây nấm nhỏ' }
  ];

  const item = types[Math.floor(Math.random() * types.length)];

  return {
    id,
    skillId: 'measurement',
    title: 'So sánh kích thước',
    questionText: item.question,
    visualType: 'story-card',
    visualData: {
      contextStory: item.question,
      emoji: '📏'
    },
    options: [item.optionA, item.optionB],
    correctAnswer: item.correct,
    hint1: `Minh An so sánh chiều dài/chiều cao của hai bạn nhé!`,
    hint2: `Nhìn bạn nào vươn cao hơn hoặc dài hơn nha!`,
    hint3: `Đáp án đúng là ${item.correct}.`,
    explanation: `Đúng rồi Minh An! Con quan sát rất tinh tế!`,
    difficulty: difficulty as 1 | 2 | 3
  };
}

// 10. Thời gian & Xem đồng hồ
function generateTimeQuestion(id: string, difficulty: number): Question {
  const hour = Math.floor(Math.random() * 8) + 1; // 1 to 8 o'clock
  const periods = [
    { hour: 7, name: '7 giờ sáng', action: 'Minh An thức dậy đi học' },
    { hour: 12, name: '12 giờ trưa', action: 'Minh An ăn trưa ngon miệng' },
    { hour: 4, name: '4 giờ chiều', action: 'Minh An tan trường về nhà' },
    { hour: 8, name: '8 giờ tối', action: 'Minh An học toán cùng Thỏ Bông' }
  ];

  const isPeriod = Math.random() > 0.5;
  if (isPeriod) {
    const p = periods[Math.floor(Math.random() * periods.length)];
    return {
      id,
      skillId: 'time',
      title: 'Các buổi trong ngày',
      questionText: `Lúc ${p.name}, ${p.action}. Đó là buổi nào trong ngày nhỉ?`,
      visualType: 'clock-read',
      visualData: {
        clockHour: p.hour,
        emoji: '⏰'
      },
      options: ['Buổi sáng', 'Buổi trưa', 'Buổi chiều', 'Buổi tối'],
      correctAnswer: p.name.includes('sáng')
        ? 'Buổi sáng'
        : p.name.includes('trưa')
        ? 'Buổi trưa'
        : p.name.includes('chiều')
        ? 'Buổi chiều'
        : 'Buổi tối',
      hint1: `Con đọc kỹ xem đề bài nhắc đến sáng, trưa, chiều hay tối nhé!`,
      hint2: `Lúc ${p.name} là thời gian quen thuộc mỗi ngày của bé!`,
      hint3: `Đáp án là: ${p.name.split(' ')[2] || 'Buổi sáng'}.`,
      explanation: `Rất tốt! Minh An nắm rõ thời gian sinh hoạt trong ngày rồi đấy!`,
      difficulty: difficulty as 1 | 2 | 3
    };
  }

  return {
    id,
    skillId: 'time',
    title: 'Xem giờ đúng',
    questionText: `Đồng hồ chỉ kim ngắn vào số ${hour}, kim dài chỉ số 12. Hỏi là mấy giờ?`,
    visualType: 'clock-read',
    visualData: {
      clockHour: hour,
      emoji: '⏰'
    },
    options: generateTimeOptions(hour),
    correctAnswer: `${hour} giờ`,
    hint1: `Khi kim dài chỉ số 12, kim ngắn chỉ vào số nào thì đó là giờ đúng!`,
    hint2: `Kim ngắn đang chỉ vào số ${hour} đó con!`,
    hint3: `Đồng hồ chỉ đúng ${hour} giờ.`,
    explanation: `Chính xác Minh An ơi! Đồng hồ đang chỉ ${hour} giờ!`,
    difficulty: difficulty as 1 | 2 | 3
  };
}

// 11. Bài toán có lời văn (Minh An là nhân vật chính)
function generateWordProblemQuestion(id: string, difficulty: number): Question {
  const isAddition = Math.random() > 0.45;
  const theme = CONTEXT_THEMES[Math.floor(Math.random() * CONTEXT_THEMES.length)];

  if (isAddition) {
    const numA = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const numB = Math.floor(Math.random() * 4) + 1; // 1 to 4
    const total = numA + numB;

    const stories = [
      `Minh An có ${numA} ${theme.item}. Mẹ tặng thêm cho Minh An ${numB} ${theme.item} nữa. Hỏi Minh An có tất cả bao nhiêu ${theme.item}?`,
      `Trong rổ của Minh An có ${numA} ${theme.item}. Bạn Thỏ Bông mang đến ${numB} ${theme.item}. Hỏi cả hai có bao nhiêu ${theme.item}?`,
      `Minh An vẽ được ${numA} ${theme.item}, sau đó vẽ thêm ${numB} ${theme.item}. Hỏi Minh An đã vẽ được bao nhiêu ${theme.item}?`
    ];

    const story = stories[Math.floor(Math.random() * stories.length)];

    return {
      id,
      skillId: 'wordProblems',
      title: 'Bài toán thêm vào',
      questionText: story,
      visualType: 'story-card',
      visualData: {
        countA: numA,
        countB: numB,
        itemsA: Array(numA).fill(theme.emoji),
        itemsB: Array(numB).fill(theme.emoji),
        operator: '+',
        contextStory: story,
        emoji: theme.emoji
      },
      options: generateNumberOptions(total, 2, 10),
      correctAnswer: total,
      hint1: `Được "tặng thêm" hoặc "vẽ thêm" là chúng mình làm phép cộng (+) nhé!`,
      hint2: `Phép tính là: ${numA} + ${numB} = ?`,
      hint3: `${numA} + ${numB} = ${total}. Có tất cả ${total} ${theme.item}.`,
      explanation: `Đúng rồi Minh An! ${numA} + ${numB} = ${total}. Con giải toán có lời văn siêu đỉnh!`,
      difficulty: difficulty as 1 | 2 | 3
    };
  } else {
    const total = Math.floor(Math.random() * 4) + 5; // 5 to 8
    const sub = Math.floor(Math.random() * (total - 2)) + 1; // 1 to total-2
    const remain = total - sub;

    const stories = [
      `Minh An có ${total} ${theme.item}. Minh An chia cho bạn ${sub} ${theme.item}. Hỏi Minh An còn lại bao nhiêu ${theme.item}?`,
      `Trên bàn có ${total} ${theme.item}. Minh An và cả nhà đã ăn ${sub} ${theme.item}. Hỏi trên bàn còn lại bao nhiêu ${theme.item}?`
    ];

    const story = stories[Math.floor(Math.random() * stories.length)];

    return {
      id,
      skillId: 'wordProblems',
      title: 'Bài toán bớt đi',
      questionText: story,
      visualType: 'story-card',
      visualData: {
        countA: total,
        subtractedCount: sub,
        itemsA: Array(total).fill(theme.emoji),
        operator: '-',
        contextStory: story,
        emoji: theme.emoji
      },
      options: generateNumberOptions(remain, 1, total),
      correctAnswer: remain,
      hint1: `"Chia cho bạn" hay "bớt đi" thì chúng mình làm phép trừ (-) nhé Minh An!`,
      hint2: `Phép tính là: ${total} - ${sub} = ?`,
      hint3: `${total} - ${sub} = ${remain}. Minh An còn lại ${remain} ${theme.item}.`,
      explanation: `Chính xác Minh An ơi! ${total} - ${sub} = ${remain}. Bé hiểu bài rất sâu!`,
      difficulty: difficulty as 1 | 2 | 3
    };
  }
}

// Generate unique options including correct answer (max 4 choices)
function generateNumberOptions(correct: number, min: number = 0, max: number = 10): number[] {
  const optionsSet = new Set<number>([correct]);
  let tries = 0;

  while (optionsSet.size < 4 && tries < 30) {
    tries++;
    const delta = Math.floor(Math.random() * 5) - 2; // -2, -1, 1, 2
    const candidate = correct + delta;
    if (candidate >= min && candidate <= max && candidate !== correct) {
      optionsSet.add(candidate);
    }
  }

  // Fallback if set is smaller than 4
  let fallback = min;
  while (optionsSet.size < 4) {
    if (!optionsSet.has(fallback)) optionsSet.add(fallback);
    fallback++;
  }

  return Array.from(optionsSet).sort((a, b) => a - b);
}

function generateTimeOptions(correctHour: number): string[] {
  const set = new Set<string>([`${correctHour} giờ`]);
  const candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  for (const h of candidates) {
    if (set.size >= 4) break;
    set.add(`${h} giờ`);
  }

  return Array.from(set).sort();
}

// ==========================================
// 12. ENGLISH: CHỮ CÁI A-Z (Phonics & Alphabet)
// ==========================================
const ENGLISH_LETTERS_DATA = [
  { upper: 'A', lower: 'a', word: 'Apple', translation: 'Quả táo', pic: '🍎' },
  { upper: 'B', lower: 'b', word: 'Ball', translation: 'Quả bóng', pic: '⚽' },
  { upper: 'C', lower: 'c', word: 'Cat', translation: 'Con mèo', pic: '🐱' },
  { upper: 'D', lower: 'd', word: 'Dog', translation: 'Con chó', pic: '🐶' },
  { upper: 'E', lower: 'e', word: 'Elephant', translation: 'Con voi', pic: '🐘' },
  { upper: 'F', lower: 'f', word: 'Fish', translation: 'Con cá', pic: '🐟' },
  { upper: 'G', lower: 'g', word: 'Giraffe', translation: 'Hươu cao cổ', pic: '🦒' },
  { upper: 'H', lower: 'h', word: 'Hat', translation: 'Cái mũ', pic: '🎩' },
  { upper: 'I', lower: 'i', word: 'Ice cream', translation: 'Que kem', pic: '🍦' },
  { upper: 'J', lower: 'j', word: 'Juice', translation: 'Nước ép', pic: '🧃' },
  { upper: 'K', lower: 'k', word: 'Kite', translation: 'Cái diều', pic: '🪁' },
  { upper: 'L', lower: 'l', word: 'Lion', translation: 'Sư tử', pic: '🦁' },
  { upper: 'M', lower: 'm', word: 'Monkey', translation: 'Con khỉ', pic: '🐵' },
  { upper: 'N', lower: 'n', word: 'Nest', translation: 'Tổ chim', pic: '🪺' },
  { upper: 'O', lower: 'o', word: 'Orange', translation: 'Quả cam', pic: '🍊' },
  { upper: 'P', lower: 'p', word: 'Panda', translation: 'Gấu trúc', pic: '🐼' },
  { upper: 'Q', lower: 'q', word: 'Queen', translation: 'Nữ hoàng', pic: '👑' },
  { upper: 'R', lower: 'r', word: 'Rabbit', translation: 'Con thỏ', pic: '🐰' },
  { upper: 'S', lower: 's', word: 'Sun', translation: 'Mặt trời', pic: '☀️' },
  { upper: 'T', lower: 't', word: 'Tiger', translation: 'Con hổ', pic: '🐯' },
  { upper: 'U', lower: 'u', word: 'Umbrella', translation: 'Cây dù', pic: '☂️' },
  { upper: 'V', lower: 'v', word: 'Van', translation: 'Xe ô tô tải nhỏ', pic: '🚐' },
  { upper: 'W', lower: 'w', word: 'Watermelon', translation: 'Dưa hấu', pic: '🍉' },
  { upper: 'Y', lower: 'y', word: 'Yo-yo', translation: 'Đồ chơi Yoyo', pic: '🪀' },
  { upper: 'Z', lower: 'z', word: 'Zebra', translation: 'Ngựa vằn', pic: '🦓' },
];

export function generateEnglishLetterQuestion(id: string, difficulty: number): Question {
  const item = ENGLISH_LETTERS_DATA[Math.floor(Math.random() * ENGLISH_LETTERS_DATA.length)];
  const mode = Math.floor(Math.random() * 3);

  if (mode === 0) {
    // Mode 1: What letter does this word start with?
    const allLetters = ENGLISH_LETTERS_DATA.map((d) => d.upper);
    const wrongLetters = allLetters.filter((l) => l !== item.upper);
    const shuffledWrong = wrongLetters.sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [item.upper, ...shuffledWrong].sort(() => Math.random() - 0.5);

    return {
      id,
      skillId: 'englishLetters',
      title: 'English Alphabet: First Letter',
      questionText: `Chữ cái nào bắt đầu cho từ "${item.word}" (${item.translation}) ${item.pic} nhỉ Minh An?`,
      visualType: 'letter-card',
      visualData: {
        letter: item.upper,
        word: item.word,
        translation: item.translation,
        picture: item.pic,
        emoji: item.pic,
      },
      options,
      correctAnswer: item.upper,
      hint1: `Bé nhìn vào chữ đầu tiên của từ "${item.word}" nhé!`,
      hint2: `Từ "${item.word}" có chữ cái đầu tiên là chữ "${item.upper}".`,
      hint3: `Đáp án chính xác là chữ ${item.upper}.`,
      explanation: `Tuyệt vời! ${item.upper} is for ${item.word} ${item.pic} (${item.translation}).`,
      difficulty: difficulty as 1 | 2 | 3,
    };
  } else if (mode === 1) {
    // Mode 2: Match upper case to lower case
    const allLower = ENGLISH_LETTERS_DATA.map((d) => d.lower);
    const wrongLower = allLower.filter((l) => l !== item.lower).sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [item.lower, ...wrongLower].sort(() => Math.random() - 0.5);

    return {
      id,
      skillId: 'englishLetters',
      title: 'English Alphabet: Upper & Lower Case',
      questionText: `Chữ viết thường tương ứng của chữ in hoa "${item.upper}" là chữ nào?`,
      visualType: 'letter-card',
      visualData: {
        letter: item.upper,
        word: `${item.upper} - ${item.lower}`,
        translation: `Chữ in hoa: ${item.upper} | Chữ in thường: ${item.lower}`,
        picture: item.pic,
        emoji: item.pic,
      },
      options,
      correctAnswer: item.lower,
      hint1: `Chữ "${item.upper}" viết thường sẽ là chữ gì bé ơi?`,
      hint2: `Ví dụ: ${item.upper} hoa đi với ${item.lower} thường.`,
      hint3: `Đáp án đúng là "${item.lower}".`,
      explanation: `Chính xác! Chữ in hoa "${item.upper}" viết thường là "${item.lower}".`,
      difficulty: difficulty as 1 | 2 | 3,
    };
  } else {
    // Mode 3: Missing letter in alphabet sequence
    const letterIdx = ENGLISH_LETTERS_DATA.findIndex((d) => d.upper === item.upper);
    const startIdx = Math.max(0, Math.min(ENGLISH_LETTERS_DATA.length - 3, letterIdx));
    const seqItems = ENGLISH_LETTERS_DATA.slice(startIdx, startIdx + 3);
    const hidePos = 1; // hide middle letter
    const correctLetter = seqItems[hidePos].upper;
    const seqDisplay = seqItems.map((s, idx) => (idx === hidePos ? '?' : s.upper));

    const otherLetters = ENGLISH_LETTERS_DATA.map((d) => d.upper).filter((l) => l !== correctLetter);
    const wrong = otherLetters.sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [correctLetter, ...wrong].sort(() => Math.random() - 0.5);

    return {
      id,
      skillId: 'englishLetters',
      title: 'English Alphabet: ABC Order',
      questionText: `Chữ cái nào còn thiếu trong dãy chữ cái: ${seqDisplay.join(' - ')}?`,
      visualType: 'letter-card',
      visualData: {
        letter: correctLetter,
        sequence: seqDisplay,
        emoji: '🔤',
      },
      options,
      correctAnswer: correctLetter,
      hint1: `Bé cùng hát bài ABC để tìm chữ cái đứng giữa nhé!`,
      hint2: `Sau chữ ${seqItems[0].upper} là chữ ${correctLetter}.`,
      hint3: `Chữ còn thiếu là ${correctLetter}.`,
      explanation: `Giỏi quá Minh An ơi! Dãy đúng là: ${seqItems.map((s) => s.upper).join(' - ')}.`,
      difficulty: difficulty as 1 | 2 | 3,
    };
  }
}

// ==========================================
// 13. ENGLISH: TỪ VỰNG QUEN THUỘC (Vocabulary)
// ==========================================
const ENGLISH_VOCAB_DATA = [
  { word: 'Cat', meaning: 'Con mèo', pic: '🐱', category: 'Thú cưng' },
  { word: 'Dog', meaning: 'Con chó', pic: '🐶', category: 'Thú cưng' },
  { word: 'Rabbit', meaning: 'Con thỏ', pic: '🐰', category: 'Thú cưng' },
  { word: 'Bird', meaning: 'Con chim', pic: '🐦', category: 'Động vật' },
  { word: 'Fish', meaning: 'Con cá', pic: '🐟', category: 'Động vật' },
  { word: 'Book', meaning: 'Quyển sách', pic: '📚', category: 'Đồ dùng học tập' },
  { word: 'Pencil', meaning: 'Bút chì', pic: '✏️', category: 'Đồ dùng học tập' },
  { word: 'Bag', meaning: 'Cái cặp sách', pic: '🎒', category: 'Đồ dùng học tập' },
  { word: 'Apple', meaning: 'Quả táo', pic: '🍎', category: 'Trái cây' },
  { word: 'Banana', meaning: 'Quả chuối', pic: '🍌', category: 'Trái cây' },
  { word: 'Milk', meaning: 'Hộp sữa', pic: '🥛', category: 'Đồ ăn uống' },
  { word: 'Cake', meaning: 'Bánh ngọt', pic: '🍰', category: 'Đồ ăn uống' },
  { word: 'Family', meaning: 'Gia đình', pic: '👨‍👩‍👧', category: 'Gia đình' },
  { word: 'Baby', meaning: 'Em bé', pic: '👶', category: 'Gia đình' },
  { word: 'Sun', meaning: 'Mặt trời', pic: '☀️', category: 'Tự nhiên' },
  { word: 'Flower', meaning: 'Bông hoa', pic: '🌸', category: 'Tự nhiên' },
];

export function generateEnglishVocabularyQuestion(id: string, difficulty: number): Question {
  const item = ENGLISH_VOCAB_DATA[Math.floor(Math.random() * ENGLISH_VOCAB_DATA.length)];
  const isEnToVi = Math.random() > 0.5;

  if (isEnToVi) {
    // English word -> choose Vietnamese meaning
    const otherMeanings = ENGLISH_VOCAB_DATA.filter((d) => d.word !== item.word).map((d) => d.meaning);
    const wrong = otherMeanings.sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [item.meaning, ...wrong].sort(() => Math.random() - 0.5);

    return {
      id,
      skillId: 'englishVocabulary',
      title: 'English Vocabulary: Meaning',
      questionText: `Từ tiếng Anh "${item.word}" ${item.pic} có nghĩa là gì trong tiếng Việt?`,
      visualType: 'word-picture-card',
      visualData: {
        word: item.word,
        translation: item.meaning,
        picture: item.pic,
        emoji: item.pic,
      },
      options,
      correctAnswer: item.meaning,
      hint1: `Bé nhìn vào hình minh họa ${item.pic} nhé!`,
      hint2: `"${item.word}" có nghĩa là ${item.meaning}.`,
      hint3: `Đáp án đúng là "${item.meaning}".`,
      explanation: `Chính xác! "${item.word}" ${item.pic} chính là "${item.meaning}".`,
      difficulty: difficulty as 1 | 2 | 3,
    };
  } else {
    // Vietnamese meaning -> choose English word
    const otherWords = ENGLISH_VOCAB_DATA.filter((d) => d.word !== item.word).map((d) => d.word);
    const wrong = otherWords.sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [item.word, ...wrong].sort(() => Math.random() - 0.5);

    return {
      id,
      skillId: 'englishVocabulary',
      title: 'English Vocabulary: Word',
      questionText: `Trong tiếng Anh, "${item.meaning}" ${item.pic} được gọi là gì?`,
      visualType: 'word-picture-card',
      visualData: {
        word: item.word,
        translation: item.meaning,
        picture: item.pic,
        emoji: item.pic,
      },
      options,
      correctAnswer: item.word,
      hint1: `Bé phát âm từ tiếng Anh chỉ ${item.pic} nhé!`,
      hint2: `Từ này bắt đầu bằng chữ "${item.word[0]}".`,
      hint3: `Đáp án đúng là "${item.word}".`,
      explanation: `Xuất sắc! "${item.meaning}" trong tiếng Anh là "${item.word}" ${item.pic}.`,
      difficulty: difficulty as 1 | 2 | 3,
    };
  }
}

// ==========================================
// 14. ENGLISH: MÀU SẮC & SỐ ĐẾM (Colors & Numbers)
// ==========================================
const ENGLISH_COLORS = [
  { en: 'Red', vi: 'Màu đỏ', pic: '🔴' },
  { en: 'Blue', vi: 'Màu xanh dương', pic: '🔵' },
  { en: 'Green', vi: 'Màu xanh lá cây', pic: '🟢' },
  { en: 'Yellow', vi: 'Màu vàng', pic: '🟡' },
  { en: 'Pink', vi: 'Màu hồng', pic: '🌸' },
  { en: 'Orange', vi: 'Màu cam', pic: '🟠' },
  { en: 'Purple', vi: 'Màu tím', pic: '🟣' },
  { en: 'White', vi: 'Màu trắng', pic: '⚪' },
  { en: 'Black', vi: 'Màu đen', pic: '⚫' },
];

const ENGLISH_NUMBERS = [
  { num: 1, en: 'One', vi: 'Số 1', pic: '1️⃣' },
  { num: 2, en: 'Two', vi: 'Số 2', pic: '2️⃣' },
  { num: 3, en: 'Three', vi: 'Số 3', pic: '3️⃣' },
  { num: 4, en: 'Four', vi: 'Số 4', pic: '4️⃣' },
  { num: 5, en: 'Five', vi: 'Số 5', pic: '5️⃣' },
  { num: 6, en: 'Six', vi: 'Số 6', pic: '6️⃣' },
  { num: 7, en: 'Seven', vi: 'Số 7', pic: '7️⃣' },
  { num: 8, en: 'Eight', vi: 'Số 8', pic: '8️⃣' },
  { num: 9, en: 'Nine', vi: 'Số 9', pic: '9️⃣' },
  { num: 10, en: 'Ten', vi: 'Số 10', pic: '🔟' },
];

export function generateEnglishColorsNumbersQuestion(id: string, difficulty: number): Question {
  const isColor = Math.random() > 0.5;

  if (isColor) {
    const col = ENGLISH_COLORS[Math.floor(Math.random() * ENGLISH_COLORS.length)];
    const askEn = Math.random() > 0.5;

    if (askEn) {
      const wrong = ENGLISH_COLORS.filter((c) => c.en !== col.en).map((c) => c.vi).sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [col.vi, ...wrong].sort(() => Math.random() - 0.5);

      return {
        id,
        skillId: 'englishColorsNumbers',
        title: 'Colors: English to Vietnamese',
        questionText: `Màu "${col.en}" ${col.pic} là màu gì trong tiếng Việt nhỉ Minh An?`,
        visualType: 'word-picture-card',
        visualData: {
          word: col.en,
          translation: col.vi,
          picture: col.pic,
          emoji: col.pic,
        },
        options,
        correctAnswer: col.vi,
        hint1: `Bé nhìn vào màu sắc ${col.pic} nha!`,
        hint2: `"${col.en}" là ${col.vi}.`,
        hint3: `Đáp án đúng là "${col.vi}".`,
        explanation: `Đúng rồi Minh An ơi! "${col.en}" chính là "${col.vi}" ${col.pic}.`,
        difficulty: difficulty as 1 | 2 | 3,
      };
    } else {
      const wrong = ENGLISH_COLORS.filter((c) => c.en !== col.en).map((c) => c.en).sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [col.en, ...wrong].sort(() => Math.random() - 0.5);

      return {
        id,
        skillId: 'englishColorsNumbers',
        title: 'Colors: Vietnamese to English',
        questionText: `"${col.vi}" ${col.pic} trong tiếng Anh được gọi là màu gì?`,
        visualType: 'word-picture-card',
        visualData: {
          word: col.en,
          translation: col.vi,
          picture: col.pic,
          emoji: col.pic,
        },
        options,
        correctAnswer: col.en,
        hint1: `Màu ${col.vi} có tên tiếng Anh bắt đầu bằng chữ "${col.en[0]}".`,
        hint2: `Đó là màu "${col.en}".`,
        hint3: `Đáp án là "${col.en}".`,
        explanation: `Tuyệt vời! "${col.vi}" trong tiếng Anh là "${col.en}" ${col.pic}.`,
        difficulty: difficulty as 1 | 2 | 3,
      };
    }
  } else {
    // Number question
    const numItem = ENGLISH_NUMBERS[Math.floor(Math.random() * (difficulty === 1 ? 5 : ENGLISH_NUMBERS.length))];
    const mode = Math.random() > 0.5 ? 'count' : 'wordToNum';

    if (mode === 'count') {
      const emoji = CUTE_ITEMS[Math.floor(Math.random() * CUTE_ITEMS.length)];
      const items = Array.from({ length: numItem.num }, () => emoji);
      const wrong = ENGLISH_NUMBERS.filter((n) => n.en !== numItem.en).map((n) => n.en).sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [numItem.en, ...wrong].sort(() => Math.random() - 0.5);

      return {
        id,
        skillId: 'englishColorsNumbers',
        title: 'Counting in English',
        questionText: `Minh An đếm xem có bao nhiêu ${emoji} bằng tiếng Anh nhé:`,
        visualType: 'item-count',
        visualData: {
          itemsA: items,
          countA: numItem.num,
          emoji,
          word: numItem.en,
        },
        options,
        correctAnswer: numItem.en,
        hint1: `Bé đếm từng hình: One, Two, Three...`,
        hint2: `Có tất cả ${numItem.num} hình, tức là "${numItem.en}".`,
        hint3: `Đáp án đúng là "${numItem.en}".`,
        explanation: `Giỏi lắm! Có ${numItem.num} ${emoji}, tiếng Anh là "${numItem.en}"!`,
        difficulty: difficulty as 1 | 2 | 3,
      };
    } else {
      const wrong = ENGLISH_NUMBERS.filter((n) => n.num !== numItem.num).map((n) => n.num).sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [numItem.num, ...wrong].sort((a, b) => a - b);

      return {
        id,
        skillId: 'englishColorsNumbers',
        title: 'Numbers in English',
        questionText: `Từ tiếng Anh "${numItem.en}" chỉ số mấy trong toán học?`,
        visualType: 'word-picture-card',
        visualData: {
          word: numItem.en,
          translation: `Số ${numItem.num}`,
          picture: numItem.pic,
          emoji: '🔢',
        },
        options,
        correctAnswer: numItem.num,
        hint1: `"${numItem.en}" tương ứng với số nào bé nhỉ?`,
        hint2: `"${numItem.en}" là số ${numItem.num}.`,
        hint3: `Đáp án là ${numItem.num}.`,
        explanation: `Chính xác! "${numItem.en}" là số ${numItem.num} ${numItem.pic}.`,
        difficulty: difficulty as 1 | 2 | 3,
      };
    }
  }
}

// ==========================================
// 15. TIẾNG VIỆT: BẢNG CHỮ CÁI & DẤU THANH
// ==========================================
const VIETNAMESE_LETTERS_DATA = [
  { letter: 'A', word: 'Áo ấm', pic: '🧥', tone: 'không dấu' },
  { letter: 'Ă', word: 'Mặt trăng', pic: '🌙', tone: 'dấu á' },
  { letter: 'Â', word: 'Cây nấm', pic: '🍄', tone: 'dấu ớ' },
  { letter: 'B', word: 'Búp bê', pic: '🪆', tone: 'không dấu' },
  { letter: 'C', word: 'Con cá', pic: '🐟', tone: 'dấu sắc' },
  { letter: 'D', word: 'Quả dâu', pic: '🍓', tone: 'không dấu' },
  { letter: 'Đ', word: 'Đồng hồ', pic: '⏰', tone: 'dấu huyền' },
  { letter: 'E', word: 'Em bé', pic: '👶', tone: 'dấu sắc' },
  { letter: 'Ê', word: 'Cái ghế', pic: '🪑', tone: 'dấu sắc' },
  { letter: 'G', word: 'Con gà', pic: '🐔', tone: 'dấu huyền' },
  { letter: 'H', word: 'Bông hoa', pic: '🌸', tone: 'không dấu' },
  { letter: 'M', word: 'Mặt trời', pic: '☀️', tone: 'dấu nặng' },
  { letter: 'N', word: 'Ngôi nhà', pic: '🏠', tone: 'dấu huyền' },
  { letter: 'O', word: 'Con ong', pic: '🐝', tone: 'không dấu' },
  { letter: 'Ô', word: 'Cái ô (dù)', pic: '☂️', tone: 'không dấu' },
  { letter: 'Ơ', word: 'Lá cờ', pic: '🚩', tone: 'dấu huyền' },
  { letter: 'T', word: 'Con thỏ', pic: '🐰', tone: 'dấu hỏi' },
  { letter: 'V', word: 'Con vịt', pic: '🦆', tone: 'dấu nặng' },
];

const VIETNAMESE_TONES = [
  { name: 'Dấu Sắc (´)', sampleWord: 'Cá 🐟', mark: '´' },
  { name: 'Dấu Huyền (`)', sampleWord: 'Gà 🐔', mark: '`' },
  { name: 'Dấu Hỏi (?)', sampleWord: 'Thỏ 🐰', mark: '?' },
  { name: 'Dấu Ngã (~)', sampleWord: 'Mũ 🧢', mark: '~' },
  { name: 'Dấu Nặng (.)', sampleWord: 'Vịt 🦆', mark: '.' },
];

export function generateVietnameseLetterQuestion(id: string, difficulty: number): Question {
  const isToneQuestion = Math.random() > 0.4;

  if (isToneQuestion) {
    // Questions about Vietnamese Tone Marks (Dấu thanh)
    const toneItem = VIETNAMESE_TONES[Math.floor(Math.random() * VIETNAMESE_TONES.length)];
    const otherTones = VIETNAMESE_TONES.filter((t) => t.name !== toneItem.name).map((t) => t.name);
    const wrong = otherTones.sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [toneItem.name, ...wrong].sort(() => Math.random() - 0.5);

    return {
      id,
      skillId: 'vietnameseLetters',
      title: 'Tiếng Việt: Nhận Biết Dấu Thanh',
      questionText: `Trong tiếng Việt, từ "${toneItem.sampleWord}" có mang dấu thanh nào sau đây?`,
      visualType: 'tone-card',
      visualData: {
        word: toneItem.sampleWord,
        toneMark: toneItem.mark,
        emoji: '🅰️',
      },
      options,
      correctAnswer: toneItem.name,
      hint1: `Bé đọc to từ "${toneItem.sampleWord}" và chú ý dấu trên đầu nguyên âm nhé!`,
      hint2: `Từ "${toneItem.sampleWord}" mang ${toneItem.name}.`,
      hint3: `Đáp án đúng là ${toneItem.name}.`,
      explanation: `Chính xác Minh An ơi! "${toneItem.sampleWord}" có mang ${toneItem.name}.`,
      difficulty: difficulty as 1 | 2 | 3,
    };
  } else {
    // Initial letter identification
    const item = VIETNAMESE_LETTERS_DATA[Math.floor(Math.random() * VIETNAMESE_LETTERS_DATA.length)];
    const allLetters = VIETNAMESE_LETTERS_DATA.map((d) => d.letter);
    const wrong = allLetters.filter((l) => l !== item.letter).sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [item.letter, ...wrong].sort(() => Math.random() - 0.5);

    return {
      id,
      skillId: 'vietnameseLetters',
      title: 'Tiếng Việt: Bảng Chữ Cái',
      questionText: `Chữ cái bắt đầu của từ "${item.word}" ${item.pic} là chữ nào?`,
      visualType: 'letter-card',
      visualData: {
        letter: item.letter,
        word: item.word,
        picture: item.pic,
        emoji: item.pic,
      },
      options,
      correctAnswer: item.letter,
      hint1: `Bé phát âm âm đầu tiên của từ "${item.word}" nhé!`,
      hint2: `Chữ cái đầu tiên là chữ "${item.letter}".`,
      hint3: `Đáp án đúng là chữ ${item.letter}.`,
      explanation: `Đúng rồi! Từ "${item.word}" ${item.pic} bắt đầu bằng chữ cái "${item.letter}".`,
      difficulty: difficulty as 1 | 2 | 3,
    };
  }
}

// ==========================================
// 16. TIẾNG VIỆT: VẦN ĐƠN GIẢN (Rhymes & Syllables)
// ==========================================
const VIETNAMESE_RHYMES_DATA = [
  { rhyme: 'an', sample: 'bạn', word: 'Người bạn', pic: '👭', hint: 'b - an - ban - nặng - bạn' },
  { rhyme: 'am', sample: 'cam', word: 'Quả cam', pic: '🍊', hint: 'c - am - cam' },
  { rhyme: 'ap', sample: 'tháp', word: 'Ngọn tháp', pic: '🗼', hint: 'th - ap - thap - sắc - tháp' },
  { rhyme: 'at', sample: 'hát', word: 'Ca hát', pic: '🎤', hint: 'h - at - hat - sắc - hát' },
  { rhyme: 'ong', sample: 'ong', word: 'Con ong', pic: '🐝', hint: 'o - ng - ong' },
  { rhyme: 'ung', sample: 'khủng long', word: 'Khủng long', pic: '🦖', hint: 'kh - ung - khung - hỏi - khủng' },
  { rhyme: 'inh', sample: 'xinh', word: 'Bé xinh xắn', pic: '👧', hint: 'x - inh - xinh' },
  { rhyme: 'anh', sample: 'bánh', word: 'Bánh kem', pic: '🎂', hint: 'b - anh - banh - sắc - bánh' },
  { rhyme: 'ai', sample: 'hoa mai', word: 'Hoa mai vàng', pic: '🌼', hint: 'm - ai - mai' },
  { rhyme: 'ao', sample: 'ngôi sao', word: 'Ngôi sao', pic: '⭐', hint: 's - ao - sao' },
  { rhyme: 'âu', sample: 'quả dâu', word: 'Quả dâu tây', pic: '🍓', hint: 'd - âu - dâu' },
  { rhyme: 'ơi', sample: 'đồ chơi', word: 'Đồ chơi', pic: '🧸', hint: 'ch - ơi - chơi' },
];

export function generateVietnameseRhymeQuestion(id: string, difficulty: number): Question {
  const item = VIETNAMESE_RHYMES_DATA[Math.floor(Math.random() * VIETNAMESE_RHYMES_DATA.length)];
  const mode = Math.random() > 0.5 ? 'findRhyme' : 'combine';

  if (mode === 'findRhyme') {
    const wrong = VIETNAMESE_RHYMES_DATA.filter((r) => r.rhyme !== item.rhyme).map((r) => r.rhyme).sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [item.rhyme, ...wrong].sort(() => Math.random() - 0.5);

    return {
      id,
      skillId: 'vietnameseRhymes',
      title: 'Tiếng Việt: Tìm Vần Đơn Giản',
      questionText: `Trong từ "${item.word}" ${item.pic}, tiếng "${item.sample}" có chứa vần gì?`,
      visualType: 'word-picture-card',
      visualData: {
        word: item.sample,
        translation: item.word,
        picture: item.pic,
        syllables: [item.rhyme],
        emoji: item.pic,
      },
      options,
      correctAnswer: item.rhyme,
      hint1: `Bé đánh vần tiếng "${item.sample}" nhé: ${item.hint}`,
      hint2: `Vần của tiếng này là vần "${item.rhyme}".`,
      hint3: `Đáp án đúng là vần "${item.rhyme}".`,
      explanation: `Tuyệt vời Minh An! Tiếng "${item.sample}" ${item.pic} chứa vần "${item.rhyme}".`,
      difficulty: difficulty as 1 | 2 | 3,
    };
  } else {
    // Combine sound and rhyme: e.g. b + anh + sắc = bánh
    const allSamples = VIETNAMESE_RHYMES_DATA.map((r) => r.sample);
    const wrong = allSamples.filter((s) => s !== item.sample).sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [item.sample, ...wrong].sort(() => Math.random() - 0.5);

    return {
      id,
      skillId: 'vietnameseRhymes',
      title: 'Tiếng Việt: Ghép Âm & Đánh Vần',
      questionText: `Đánh vần "${item.hint}" sẽ tạo thành tiếng nào sau đây? ${item.pic}`,
      visualType: 'tone-card',
      visualData: {
        word: item.hint,
        picture: item.pic,
        emoji: '🧩',
      },
      options,
      correctAnswer: item.sample,
      hint1: `Bé đọc nối các âm lại với nhau thật nhanh nhé!`,
      hint2: `Khi ghép lại ta được tiếng "${item.sample}".`,
      hint3: `Đáp án là "${item.sample}".`,
      explanation: `Rất giỏi! Đánh vần ${item.hint} ra tiếng "${item.sample}" ${item.pic}!`,
      difficulty: difficulty as 1 | 2 | 3,
    };
  }
}

// ==========================================
// 17. TIẾNG VIỆT: ĐỌC HIỂU CÂU NGẮN
// ==========================================
const VIETNAMESE_READING_DATA = [
  {
    sentence: 'Bé Minh An có chú thỏ trắng rất đáng yêu. Chú thỏ thích ăn cà rốt ngọt.',
    question: 'Chú thỏ của Minh An thích ăn món gì?',
    pic: '🐰🥕',
    correct: 'Cà rốt ngọt',
    wrong: ['Cá rán', 'Kẹo dâu', 'Kem sô-cô-la'],
    hint: 'Bé đọc câu thứ hai: "Chú thỏ thích ăn..."',
  },
  {
    sentence: 'Mẹ đi chợ mua cho Minh An một chiếc nơ màu hồng thật xinh.',
    question: 'Mẹ mua cho Minh An chiếc nơ màu gì?',
    pic: '🎀🌸',
    correct: 'Màu hồng',
    wrong: ['Màu xanh', 'Màu vàng', 'Màu đen'],
    hint: 'Chiếc nơ mẹ mua có "màu hồng thật xinh".',
  },
  {
    sentence: 'Bé Mai tưới hoa cúc. Bạn Nam chăm sóc chú mèo con.',
    question: 'Bạn nào là người tưới hoa cúc?',
    pic: '🌼👧',
    correct: 'Bé Mai',
    wrong: ['Bạn Nam', 'Bé Thỏ', 'Cô giáo'],
    hint: 'Câu đầu tiên viết: "Bé Mai tưới..."',
  },
  {
    sentence: 'Bầu trời mùa thu trong xanh. Đàn chim én bay lượn trên cao.',
    question: 'Đàn chim én bay lượn ở đâu?',
    pic: '🐦☁️',
    correct: 'Bầu trời trên cao',
    wrong: ['Dưới mặt đất', 'Trong bể nước', 'Trong hang động'],
    hint: 'Bầu trời trong xanh và đàn chim bay trên cao.',
  },
  {
    sentence: 'Minh An cùng cả nhà đi công viên ngắm hoa và thả diều.',
    question: 'Minh An cùng cả nhà đi đâu?',
    pic: '🪁🌳',
    correct: 'Công viên',
    wrong: ['Siêu thị', 'Nhà sách', 'Sở thú'],
    hint: 'Đọc câu: "Minh An cùng cả nhà đi..."',
  },
];

export function generateVietnameseReadingQuestion(id: string, difficulty: number): Question {
  const item = VIETNAMESE_READING_DATA[Math.floor(Math.random() * VIETNAMESE_READING_DATA.length)];
  const options = [item.correct, ...item.wrong].sort(() => Math.random() - 0.5);

  return {
    id,
    skillId: 'vietnameseReading',
    title: 'Tiếng Việt: Đọc Hiểu Câu Ngắn',
    questionText: item.question,
    visualType: 'reading-card',
    visualData: {
      sentence: item.sentence,
      picture: item.pic,
      emoji: '📖',
    },
    options,
    correctAnswer: item.correct,
    hint1: item.hint,
    hint2: `Đọc kỹ lại đoạn văn ngắn phía trên nhé Minh An!`,
    hint3: `Đáp án đúng là "${item.correct}".`,
    explanation: `Chúc mừng Minh An! Con đọc hiểu câu rất tốt và đã trả lời chính xác: "${item.correct}".`,
    difficulty: difficulty as 1 | 2 | 3,
  };
}

