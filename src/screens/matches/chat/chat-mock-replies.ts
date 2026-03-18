/**
 * chat-mock-replies
 *
 * Mock reply data and helper for simulated chat responses
 */

export const MOCK_REPLIES = [
  'Nghe hay đó! Bạn rảnh lúc nào đi chơi? 🎾',
  'Mình thường chơi ở sân Phú Nhuận, bạn biết không? 🏟️',
  'Weekend này mình rảnh nè, đánh một trận không? 💪',
  'Level mình khoảng 3.5, chơi vui thôi 😄',
  'Oke luôn! Hẹn gặp nha 👋',
  'Mình mới bắt đầu chơi 2 tháng thôi, bạn chỉ mình nha 🙏',
  'Sân đó đẹp lắm, mình hay chơi buổi sáng 🌅',
  'Có muốn chơi doubles không? Mình có thêm 2 bạn nữa 🤝',
  'Thời tiết mai đẹp quá, ra sân thôi! ☀️',
  'Bạn chơi paddle nào? Mình đang muốn đổi paddle mới 🏓',
];

let lastReplyIndex = -1;

/** Pick a random reply, avoiding repeating the last one */
export function getRandomReply(): string {
  let index: number;
  do {
    index = Math.floor(Math.random() * MOCK_REPLIES.length);
  } while (index === lastReplyIndex && MOCK_REPLIES.length > 1);
  lastReplyIndex = index;
  return MOCK_REPLIES[index];
}
