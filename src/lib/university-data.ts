/** 주요 4년제 대학 기본 데이터 (공공데이터 API 연동 전 폴백) */
export interface UniversityInfo {
  name: string;
  region: string;
  type: string; // 국립, 사립
  category: string; // 종합대학, 산업대학, 교육대학 등
  address: string;
  phone: string;
  homepage: string;
  admissionUrl: string;
}

export const UNIVERSITIES: UniversityInfo[] = [
  // === 서울 ===
  { name: "서울대학교", region: "서울", type: "국립", category: "종합대학", address: "서울 관악구 관악로 1", phone: "02-880-5114", homepage: "https://www.snu.ac.kr", admissionUrl: "https://admission.snu.ac.kr" },
  { name: "연세대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 서대문구 연세로 50", phone: "02-2123-2114", homepage: "https://www.yonsei.ac.kr", admissionUrl: "https://admission.yonsei.ac.kr" },
  { name: "고려대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 성북구 안암로 145", phone: "02-3290-1114", homepage: "https://www.korea.ac.kr", admissionUrl: "https://oku.korea.ac.kr" },
  { name: "성균관대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 종로구 성균관로 25-2", phone: "02-760-0114", homepage: "https://www.skku.edu", admissionUrl: "https://admission.skku.edu" },
  { name: "한양대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 성동구 왕십리로 222", phone: "02-2220-0114", homepage: "https://www.hanyang.ac.kr", admissionUrl: "https://go.hanyang.ac.kr" },
  { name: "중앙대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 동작구 흑석로 84", phone: "02-820-5114", homepage: "https://www.cau.ac.kr", admissionUrl: "https://admission.cau.ac.kr" },
  { name: "경희대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 동대문구 경희대로 26", phone: "02-961-0114", homepage: "https://www.khu.ac.kr", admissionUrl: "https://iphak.khu.ac.kr" },
  { name: "서강대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 마포구 백범로 35", phone: "02-705-8114", homepage: "https://www.sogang.ac.kr", admissionUrl: "https://admission.sogang.ac.kr" },
  { name: "이화여자대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 서대문구 이화여대길 52", phone: "02-3277-2114", homepage: "https://www.ewha.ac.kr", admissionUrl: "https://admission.ewha.ac.kr" },
  { name: "한국외국어대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 동대문구 이문로 107", phone: "02-2173-2114", homepage: "https://www.hufs.ac.kr", admissionUrl: "https://admission.hufs.ac.kr" },
  { name: "서울시립대학교", region: "서울", type: "공립", category: "종합대학", address: "서울 동대문구 서울시립대로 163", phone: "02-6490-6114", homepage: "https://www.uos.ac.kr", admissionUrl: "https://iphak.uos.ac.kr" },
  { name: "건국대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 광진구 능동로 120", phone: "02-450-3114", homepage: "https://www.konkuk.ac.kr", admissionUrl: "https://enter.konkuk.ac.kr" },
  { name: "동국대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 중구 필동로1길 30", phone: "02-2260-3114", homepage: "https://www.dongguk.edu", admissionUrl: "https://ipsi.dongguk.edu" },
  { name: "홍익대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 마포구 와우산로 94", phone: "02-320-1114", homepage: "https://www.hongik.ac.kr", admissionUrl: "https://admission.hongik.ac.kr" },
  { name: "숙명여자대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 용산구 청파로47길 100", phone: "02-710-9114", homepage: "https://www.sookmyung.ac.kr", admissionUrl: "https://admission.sookmyung.ac.kr" },
  { name: "국민대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 성북구 정릉로 77", phone: "02-910-4114", homepage: "https://www.kookmin.ac.kr", admissionUrl: "https://admission.kookmin.ac.kr" },
  { name: "숭실대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 동작구 상도로 369", phone: "02-820-0114", homepage: "https://www.ssu.ac.kr", admissionUrl: "https://admission.ssu.ac.kr" },
  { name: "세종대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 광진구 능동로 209", phone: "02-3408-3114", homepage: "https://www.sejong.ac.kr", admissionUrl: "https://admission.sejong.ac.kr" },
  { name: "한성대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 성북구 삼선교로 116", phone: "02-760-4114", homepage: "https://www.hansung.ac.kr", admissionUrl: "https://admission.hansung.ac.kr" },
  { name: "광운대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 노원구 광운로 20", phone: "02-940-5114", homepage: "https://www.kw.ac.kr", admissionUrl: "https://admission.kw.ac.kr" },
  { name: "상명대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 종로구 홍지문2길 20", phone: "02-781-7114", homepage: "https://www.smu.ac.kr", admissionUrl: "https://admission.smu.ac.kr" },
  // === 경기 ===
  { name: "아주대학교", region: "경기", type: "사립", category: "종합대학", address: "경기 수원시 영통구 월드컵로 206", phone: "031-219-2114", homepage: "https://www.ajou.ac.kr", admissionUrl: "https://admission.ajou.ac.kr" },
  { name: "인하대학교", region: "인천", type: "사립", category: "종합대학", address: "인천 미추홀구 인하로 100", phone: "032-860-7114", homepage: "https://www.inha.ac.kr", admissionUrl: "https://admission.inha.ac.kr" },
  { name: "가톨릭대학교", region: "경기", type: "사립", category: "종합대학", address: "경기 부천시 지봉로 43", phone: "02-2164-4114", homepage: "https://www.catholic.ac.kr", admissionUrl: "https://admission.catholic.ac.kr" },
  // === 부산 ===
  { name: "부산대학교", region: "부산", type: "국립", category: "종합대학", address: "부산 금정구 부산대학로 63번길 2", phone: "051-510-1114", homepage: "https://www.pusan.ac.kr", admissionUrl: "https://go.pusan.ac.kr" },
  // === 대구 ===
  { name: "경북대학교", region: "대구", type: "국립", category: "종합대학", address: "대구 북구 대학로 80", phone: "053-950-5114", homepage: "https://www.knu.ac.kr", admissionUrl: "https://admission.knu.ac.kr" },
  // === 대전 ===
  { name: "KAIST", region: "대전", type: "국립", category: "특수대학", address: "대전 유성구 대학로 291", phone: "042-350-2114", homepage: "https://www.kaist.ac.kr", admissionUrl: "https://admission.kaist.ac.kr" },
  { name: "충남대학교", region: "대전", type: "국립", category: "종합대학", address: "대전 유성구 대학로 99", phone: "042-821-5114", homepage: "https://www.cnu.ac.kr", admissionUrl: "https://ipsi.cnu.ac.kr" },
  // === 광주 ===
  { name: "전남대학교", region: "광주", type: "국립", category: "종합대학", address: "광주 북구 용봉로 77", phone: "062-530-5114", homepage: "https://www.jnu.ac.kr", admissionUrl: "https://admission.jnu.ac.kr" },
  // === 강원 ===
  { name: "강원대학교", region: "강원", type: "국립", category: "종합대학", address: "강원 춘천시 강원대학길 1", phone: "033-250-6114", homepage: "https://www.kangwon.ac.kr", admissionUrl: "https://admission.kangwon.ac.kr" },
  // === 충북 ===
  { name: "충북대학교", region: "충북", type: "국립", category: "종합대학", address: "충북 청주시 서원구 충대로 1", phone: "043-261-2114", homepage: "https://www.chungbuk.ac.kr", admissionUrl: "https://ipsi.chungbuk.ac.kr" },
  // === 전북 ===
  { name: "전북대학교", region: "전북", type: "국립", category: "종합대학", address: "전북 전주시 덕진구 백제대로 567", phone: "063-270-2114", homepage: "https://www.jbnu.ac.kr", admissionUrl: "https://admission.jbnu.ac.kr" },
  // === 경남 ===
  { name: "경상국립대학교", region: "경남", type: "국립", category: "종합대학", address: "경남 진주시 진주대로 501", phone: "055-772-0114", homepage: "https://www.gnu.ac.kr", admissionUrl: "https://admission.gnu.ac.kr" },
  // === 제주 ===
  { name: "제주대학교", region: "제주", type: "국립", category: "종합대학", address: "제주 제주시 제주대학로 102", phone: "064-754-2114", homepage: "https://www.jejunu.ac.kr", admissionUrl: "https://admission.jejunu.ac.kr" },
  // === 포항 ===
  { name: "POSTECH", region: "경북", type: "사립", category: "특수대학", address: "경북 포항시 남구 청암로 77", phone: "054-279-0114", homepage: "https://www.postech.ac.kr", admissionUrl: "https://admission.postech.ac.kr" },
  // === 울산 ===
  { name: "울산대학교", region: "울산", type: "사립", category: "종합대학", address: "울산 남구 대학로 93", phone: "052-220-5000", homepage: "https://www.ulsan.ac.kr", admissionUrl: "https://ipsi.ulsan.ac.kr" },
  { name: "UNIST", region: "울산", type: "국립", category: "특수대학", address: "울산 울주군 유니스트길 50", phone: "052-217-0114", homepage: "https://www.unist.ac.kr", admissionUrl: "https://admission.unist.ac.kr" },
];

const regions = ["서울", "경기", "인천", "부산", "대구", "대전", "광주", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];

export function getUniversitiesByRegion(region?: string): UniversityInfo[] {
  if (!region || region === "전체") return UNIVERSITIES;
  return UNIVERSITIES.filter((u) => u.region === region);
}

export function searchUniversities(query: string): UniversityInfo[] {
  const q = query.toLowerCase();
  return UNIVERSITIES.filter((u) => u.name.toLowerCase().includes(q) || u.address.includes(q));
}
