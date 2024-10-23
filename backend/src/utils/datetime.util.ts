export function convertToKoreanISOString(utcDateString: string) {
    // UTC 시간을 Date 객체로 변환
    const utcDate = new Date(utcDateString);
    
    // 한국 시간으로 조정 (UTC+9)
    const koreanDate = new Date(utcDate.getTime() + (9 * 60 * 60 * 1000));
    
    // ISO 문자열로 변환하고 시간대 정보 추가
    const isoString = koreanDate.toISOString().slice(0, -1) + '+09:00';
    
    return isoString;
  }