// constants/responseMessage.ts
export default {
  NULL_VALUE: "필요한 값이 없습니다.",
  OUT_OF_VALUE: "파라미터 값이 잘못되었습니다.",
  NOT_FOUND: "잘못된 경로입니다.",
  BAD_REQUEST: "잘못된 요청입니다.",

  // 회원가입 및 로그인
  SIGNUP_SUCCESS: "회원 가입 성공",
  SIGNUP_FAIL: "회원 가입 실패",
  SIGNIN_SUCCESS: "로그인 성공",
  SIGNIN_FAIL: "로그인 실패",
  ALREADY_NICKNAME: "이미 사용중인 닉네임입니다.",
  INVALID_PASSWORD: "잘못된 비밀번호입니다.",

  // 유저
  READ_USER_SUCCESS: "유저 조회 성공",
  READ_ALL_USERS_SUCCESS: "모든 유저 조회 성공",
  UPDATE_USER_SUCCESS: "유저 수정 성공",
  DELETE_USER_SUCCESS: "유저 탈퇴 성공",
  DELETE_USER_FAIL: "유저 탈퇴 실패",
  NO_USER: "존재하지 않는 유저",

  // 코스
  READ_COURSE_SUCCESS: "코스 조회 성공",
  READ_PRIVATE_COURSE_SUCCESS: "private 코스 조회 성공",

  // 코스
  CREATE_COURSE_SUCCESS: "코스 생성 성공",
  CREATE_COURSE_FAIL: "코스 생성 실패",
  NO_COURSE: "경로 정보 없음.",
  NO_DISTANCE: "거리 정보 없음",
  NO_DEPARTURE: "출발지 정보 없음",
  NO_IMAGE: "이미지 정보 없음",
  NO_PATH: "경로 정보 없음",

  // 토큰
  CREATE_TOKEN_SUCCESS: "토큰 재발급 성공",
  EXPIRED_TOKEN: "토큰이 만료되었습니다.",
  EXPIRED_ALL_TOKEN: "모든 토큰이 만료되었습니다.",
  INVALID_TOKEN: "유효하지 않은 토큰입니다.",
  VALID_TOKEN: "유효한 토큰입니다.",
  EMPTY_TOKEN: "토큰 값이 없습니다.",

  // 서버 내 오류
  INTERNAL_SERVER_ERROR: "서버 내 오류",

  //public Course
  NO_CONTENT: "제목과 설명이 없습니다.",
  UPLOAD_PUBLIC_COURSE: "코스 업로드 성공",
  READ_PUBLIC_COURSE_BY_USER: "유저가 업로드한 코스 조회 성공",
  INVALID_PUBLIC_COURSE_ID: "유효하지 않은 퍼블릭 코스 아이디 입니다.",
  READ_PUBLIC_COURSE_DETAIL_SUCCESS: "업로드 코스 상세 조회 성공",
  READ_RECOMMENDED_COURSE_SUCCESS: "추천 코스 조회 성공",
  READ_SEARCHED_COURSE_SUCCESS: "업로드된 코스 검색 성공",

  //record
  UPLOAD_RECORD: "경로기록하기 성공",
  INVALID_COURSEID: "유효하지 않은 코스 아이디",
  NO_RECORD_TITLE: "경로 타이틀 없음",
  NO_RECORD_TIME: "경로 뛴 시간 없음",
  NO_RECORD_PACE: "경로 뛴 페이스 없음",
  NO_COURSE_ID: "코스아이디 없음",
  NO_RECORD: "유저의 러닝 기록이 없음",
  READ_RECORD_SUCCESS: "활동 기록 조회 성공",
};
