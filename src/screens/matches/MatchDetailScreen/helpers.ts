/** Helper functions for MatchDetailScreen */

export const getSkillLevelLabel = (level: string): { label: string; emoji: string } => {
  const labels: Record<string, { label: string; emoji: string }> = {
    beginner: { label: 'Mới bắt đầu', emoji: '🌱' },
    intermediate: { label: 'Trung bình', emoji: '🎯' },
    advanced: { label: 'Nâng cao', emoji: '⚡' },
    pro: { label: 'Chuyên nghiệp', emoji: '🏆' },
  };
  return labels[level] || { label: level, emoji: '🎾' };
};

export const getPlayStyleLabel = (style: string): string => {
  const labels: Record<string, string> = {
    competitive: 'Cạnh tranh 🔥',
    casual: 'Thư giãn 😊',
    social: 'Giao lưu 🤝',
  };
  return labels[style] || style;
};

export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export const LOOKING_FOR_LABELS: Record<string, string> = {
  opponent: 'Đối thủ đơn',
  doubles_partner: 'Partner đôi',
  dating: 'Hẹn hò',
};
