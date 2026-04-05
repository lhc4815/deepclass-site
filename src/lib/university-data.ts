export interface UniversityInfo {
  name: string;
  region: string;
  type: string;
  category: string;
  address: string;
  phone: string;
  homepage: string;
  admissionUrl: string;
}

export const UNIVERSITIES: UniversityInfo[] = [
  // === 서울 (40개) ===
  { name: "서울대학교", region: "서울", type: "국립", category: "종합대학", address: "서울 관악구 관악로 1", phone: "02-880-5114", homepage: "https://www.snu.ac.kr", admissionUrl: "https://admission.snu.ac.kr" },
  { name: "연세대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 서대문구 연세로 50", phone: "02-2123-2114", homepage: "https://www.yonsei.ac.kr", admissionUrl: "https://admission.yonsei.ac.kr" },
  { name: "고려대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 성북구 안암로 145", phone: "02-3290-1114", homepage: "https://www.korea.ac.kr", admissionUrl: "https://oku.korea.ac.kr" },
  { name: "성균관대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 종로구 성균관로 25-2", phone: "02-760-0114", homepage: "https://www.skku.edu", admissionUrl: "https://admission.skku.edu" },
  { name: "���양대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 성동구 왕십리로 222", phone: "02-2220-0114", homepage: "https://www.hanyang.ac.kr", admissionUrl: "https://go.hanyang.ac.kr" },
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
  { name: "단국대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 용산구 한남로 152", phone: "02-709-2114", homepage: "https://www.dankook.ac.kr", admissionUrl: "https://admission.dankook.ac.kr" },
  { name: "명지대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 서대문구 거북골로 34", phone: "02-300-0114", homepage: "https://www.mju.ac.kr", admissionUrl: "https://admission.mju.ac.kr" },
  { name: "서울과학기술대학교", region: "서울", type: "국립", category: "종합대학", address: "서울 노원구 공릉로 232", phone: "02-970-6114", homepage: "https://www.seoultech.ac.kr", admissionUrl: "https://admission.seoultech.ac.kr" },
  { name: "서울교육대학교", region: "서울", type: "국립", category: "교육대학", address: "서울 서초구 서초중앙로 96", phone: "02-3475-2114", homepage: "https://www.snue.ac.kr", admissionUrl: "https://www.snue.ac.kr" },
  { name: "한국체육대학교", region: "서울", type: "국립", category: "특수대학", address: "서울 송파구 양재대로 1239", phone: "02-410-6700", homepage: "https://www.knsu.ac.kr", admissionUrl: "https://www.knsu.ac.kr" },
  { name: "한국예술종합학교", region: "서울", type: "국립", category: "특수대학", address: "서울 성북구 화랑로 146", phone: "02-746-9000", homepage: "https://www.karts.ac.kr", admissionUrl: "https://www.karts.ac.kr" },
  { name: "추계예술대학교", region: "서울", type: "사립", category: "특수대학", address: "서울 서대문구 독립문로 40", phone: "02-362-7856", homepage: "https://www.chugye.ac.kr", admissionUrl: "https://ipsi.chugye.ac.kr" },
  { name: "서울여자대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 노원구 화랑로 621", phone: "02-970-5114", homepage: "https://www.swu.ac.kr", admissionUrl: "https://admission.swu.ac.kr" },
  { name: "덕성여자대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 도봉구 삼양로144길 33", phone: "02-901-8114", homepage: "https://www.duksung.ac.kr", admissionUrl: "https://admission.duksung.ac.kr" },
  { name: "동덕여자대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 성북구 화랑로13길 60", phone: "02-940-4000", homepage: "https://www.dongduk.ac.kr", admissionUrl: "https://admission.dongduk.ac.kr" },
  { name: "성신여자대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 성북구 보문로34다길 2", phone: "02-920-7114", homepage: "https://www.sungshin.ac.kr", admissionUrl: "https://admission.sungshin.ac.kr" },
  { name: "삼육대학교", region: "서울", type: "사립", category: "종합대학", address: "서울 노원구 화랑로 815", phone: "02-3399-3636", homepage: "https://www.sahmyook.ac.kr", admissionUrl: "https://admission.sahmyook.ac.kr" },
  // === 경기/인천 (15개) ===
  { name: "아주대학교", region: "경기", type: "사립", category: "종합대학", address: "경기 수원시 영통구 월드컵로 206", phone: "031-219-2114", homepage: "https://www.ajou.ac.kr", admissionUrl: "https://admission.ajou.ac.kr" },
  { name: "인하대학교", region: "인천", type: "사립", category: "종합대학", address: "인천 미추홀구 인하로 100", phone: "032-860-7114", homepage: "https://www.inha.ac.kr", admissionUrl: "https://admission.inha.ac.kr" },
  { name: "가톨릭대학교", region: "경기", type: "사립", category: "종합대학", address: "경기 부천시 지봉로 43", phone: "02-2164-4114", homepage: "https://www.catholic.ac.kr", admissionUrl: "https://admission.catholic.ac.kr" },
  { name: "경기대학교", region: "경기", type: "사립", category: "종합대학", address: "경기 수원시 영통구 광교산로 154-42", phone: "031-249-9114", homepage: "https://www.kyonggi.ac.kr", admissionUrl: "https://admission.kyonggi.ac.kr" },
  { name: "수원대학교", region: "경기", type: "사립", category: "종합대학", address: "경기 화성시 봉담읍 와우안길 17", phone: "031-220-2114", homepage: "https://www.suwon.ac.kr", admissionUrl: "https://admission.suwon.ac.kr" },
  { name: "한국항공대학교", region: "경기", type: "사립", category: "종합대학", address: "경기 고양시 덕양구 항공대학로 76", phone: "02-300-0114", homepage: "https://www.kau.ac.kr", admissionUrl: "https://admission.kau.ac.kr" },
  { name: "한신대학교", region: "경기", type: "사립", category: "종합대학", address: "경기 오산시 한신대길 137", phone: "031-379-0114", homepage: "https://www.hs.ac.kr", admissionUrl: "https://admission.hs.ac.kr" },
  { name: "가천대학교", region: "경기", type: "사립", category: "종합대학", address: "경기 성남시 수정구 성남대로 1342", phone: "031-750-5114", homepage: "https://www.gachon.ac.kr", admissionUrl: "https://admission.gachon.ac.kr" },
  { name: "인천대학교", region: "인천", type: "공립", category: "종합대학", address: "인천 연수구 아카데미로 119", phone: "032-835-8114", homepage: "https://www.inu.ac.kr", admissionUrl: "https://admission.inu.ac.kr" },
  { name: "차의과학대학교", region: "경기", type: "사립", category: "종합대학", address: "경기 포천시 해룡로 120", phone: "031-850-8914", homepage: "https://www.cha.ac.kr", admissionUrl: "https://ipsi.cha.ac.kr" },
  // === 부산/울산/경남 (10개) ===
  { name: "부산대학교", region: "부산", type: "국립", category: "종합대학", address: "부산 금정구 부산대학로 63번길 2", phone: "051-510-1114", homepage: "https://www.pusan.ac.kr", admissionUrl: "https://go.pusan.ac.kr" },
  { name: "부경대학교", region: "부산", type: "국립", category: "종합대학", address: "부산 남구 용소로 45", phone: "051-629-4114", homepage: "https://www.pknu.ac.kr", admissionUrl: "https://admission.pknu.ac.kr" },
  { name: "동아대학교", region: "부산", type: "사립", category: "종합대학", address: "부산 사하구 낙동대로 550번길 37", phone: "051-200-6442", homepage: "https://www.donga.ac.kr", admissionUrl: "https://ipsi.donga.ac.kr" },
  { name: "UNIST", region: "울산", type: "국립", category: "특수대학", address: "울산 울주군 유니스트길 50", phone: "052-217-0114", homepage: "https://www.unist.ac.kr", admissionUrl: "https://admission.unist.ac.kr" },
  { name: "울산대학교", region: "울산", type: "사립", category: "종합대학", address: "울산 남구 대학로 93", phone: "052-220-5000", homepage: "https://www.ulsan.ac.kr", admissionUrl: "https://ipsi.ulsan.ac.kr" },
  { name: "경상국립대학교", region: "경남", type: "국립", category: "종합대학", address: "경남 진주시 진주대로 501", phone: "055-772-0114", homepage: "https://www.gnu.ac.kr", admissionUrl: "https://admission.gnu.ac.kr" },
  // === 대구/경북 (8개) ===
  { name: "경북대학교", region: "대구", type: "국립", category: "종합대학", address: "대구 북구 대학로 80", phone: "053-950-5114", homepage: "https://www.knu.ac.kr", admissionUrl: "https://admission.knu.ac.kr" },
  { name: "POSTECH", region: "경북", type: "사립", category: "특수대학", address: "경북 포항시 남구 청암로 77", phone: "054-279-0114", homepage: "https://www.postech.ac.kr", admissionUrl: "https://admission.postech.ac.kr" },
  { name: "영남대학교", region: "대구", type: "사립", category: "종합대학", address: "경북 경산시 대학로 280", phone: "053-810-1114", homepage: "https://www.yu.ac.kr", admissionUrl: "https://admission.yu.ac.kr" },
  { name: "계명대학교", region: "대구", type: "사립", category: "종합대학", address: "대구 달서구 달구벌대로 1095", phone: "053-580-5114", homepage: "https://www.kmu.ac.kr", admissionUrl: "https://admission.kmu.ac.kr" },
  // === 대전/충청/세종 (10개) ===
  { name: "KAIST", region: "대전", type: "국립", category: "특수대학", address: "대전 유성구 대학로 291", phone: "042-350-2114", homepage: "https://www.kaist.ac.kr", admissionUrl: "https://admission.kaist.ac.kr" },
  { name: "충남대학교", region: "대전", type: "국립", category: "종합대학", address: "대전 유성구 대학로 99", phone: "042-821-5114", homepage: "https://www.cnu.ac.kr", admissionUrl: "https://ipsi.cnu.ac.kr" },
  { name: "충북대학교", region: "충북", type: "국립", category: "종합대학", address: "충북 청주시 서원구 충대로 1", phone: "043-261-2114", homepage: "https://www.chungbuk.ac.kr", admissionUrl: "https://ipsi.chungbuk.ac.kr" },
  { name: "한남대학교", region: "대전", type: "사립", category: "종합대학", address: "대전 대덕구 한남로 70", phone: "042-629-7114", homepage: "https://www.hannam.ac.kr", admissionUrl: "https://admission.hannam.ac.kr" },
  { name: "한국과학기술원(KAIST)", region: "세종", type: "국립", category: "특수대학", address: "세종 세종특별자치시 조치원읍 세종로 2511", phone: "044-860-1114", homepage: "https://www.kaist.ac.kr", admissionUrl: "https://admission.kaist.ac.kr" },
  { name: "홍익대학교 세종", region: "세종", type: "사립", category: "종합대학", address: "세종 조치원읍 세종로 2639", phone: "044-860-2114", homepage: "https://sejong.hongik.ac.kr", admissionUrl: "https://admission.hongik.ac.kr" },
  // === 광주/전라 (8개) ===
  { name: "전남대학교", region: "광주", type: "국립", category: "종합대학", address: "광주 북구 용봉로 77", phone: "062-530-5114", homepage: "https://www.jnu.ac.kr", admissionUrl: "https://admission.jnu.ac.kr" },
  { name: "조선대학교", region: "광주", type: "사립", category: "종합대학", address: "광주 동구 필문대로 309", phone: "062-230-7114", homepage: "https://www.chosun.ac.kr", admissionUrl: "https://iphak.chosun.ac.kr" },
  { name: "전북대학교", region: "전북", type: "국립", category: "종합대학", address: "전북 전주시 덕진구 백제대로 567", phone: "063-270-2114", homepage: "https://www.jbnu.ac.kr", admissionUrl: "https://admission.jbnu.ac.kr" },
  { name: "광주과학기술원(GIST)", region: "광주", type: "국립", category: "특수대학", address: "광주 북구 첨단과기로 123", phone: "062-715-2114", homepage: "https://www.gist.ac.kr", admissionUrl: "https://admission.gist.ac.kr" },
  // === 강원/제주 (5개) ===
  { name: "강원대학교", region: "강원", type: "국립", category: "종합대학", address: "강원 춘천시 강원대학길 1", phone: "033-250-6114", homepage: "https://www.kangwon.ac.kr", admissionUrl: "https://admission.kangwon.ac.kr" },
  { name: "한림대학교", region: "강원", type: "사립", category: "종합대학", address: "강원 춘천시 한림대학길 1", phone: "033-248-1000", homepage: "https://www.hallym.ac.kr", admissionUrl: "https://admission.hallym.ac.kr" },
  { name: "제주대학교", region: "제주", type: "국립", category: "종합대학", address: "제주 제주시 제주대학로 102", phone: "064-754-2114", homepage: "https://www.jejunu.ac.kr", admissionUrl: "https://admission.jejunu.ac.kr" },
];
