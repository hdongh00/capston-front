export const formattedDateTime = (createAt:number[]) => {
  if(!createAt) return '';
  const today = new Date();

  const formattedDate = `${createAt[0]}-${String(createAt[1]).padStart(2, '0')}-${String(createAt[2]).padStart(2, '0')}T${String(createAt[3]).padStart(2, '0')}:${String(createAt[4]).padStart(2, '0')}:${String(createAt[5]).padStart(2, '0')}`;
  const createDate = new Date(formattedDate);
  
  const diffMs = today.getTime() - createDate.getTime();
  const diffInMinutes = Math.floor(diffMs / (1000 * 60));
  const diffInHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "방금 전";
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  if (diffInDays < 1) return `${diffInDays}일 전`;

  return `${createAt[0]}.${String(createAt[1]).padStart(2, '0')}.${String(createAt[2]).padStart(2, '0')} ${String(createAt[3]).padStart(2, '0')}:${String(createAt[4]).padStart(2, '0')}`;
}