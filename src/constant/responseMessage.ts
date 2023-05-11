// constants/responseMessage.ts
export default {
  NULL_VALUE: "필요한 값이 없습니다.",
  OUT_OF_VALUE: "파라미터 값이 잘못되었습니다.",
  NOT_FOUND: "잘못된 경로입니다.",
  BAD_REQUEST: "잘못된 요청입니다.",

  // 회원가입 및 로그인
  SIGNUP_SUCCESS: "회원 가입 성공",
  SIGNUP_FAIL: "회원 가입 실패",
  LOGIN_SUCCESS: "로그인 성공",
  LOGIN_FAIL: "로그인 실패",
  ALREADY_NICKNAME: "이미 사용중인 닉네임입니다.",
  INVALID_PASSWORD: "잘못된 비밀번호입니다.",

  // 유저
  READ_USER_SUCCESS: "유저 조회 성공",
  READ_USER_FAIL: "유저 조회 실패",
  READ_ALL_USERS_SUCCESS: "모든 유저 조회 성공",
  UPDATE_USER_SUCCESS: "유저 수정 성공",
  DELETE_USER_SUCCESS: "유저 탈퇴 성공",
  DELETE_USER_FAIL: "유저 탈퇴 실패",
  NO_USER: "존재하지 않는 유저",
  UPDATE_USER_FAIL: "유저 업데이트 실패",

  // 소셜로그인
  READ_SOCIAL_FAIL: "소셜로그인 회원 정보 조회 실패",
  WITHDRAW_APPLE_SOCIAL_FAIL: "애플 소셜회원 탈퇴 실패",

  // 코스
  READ_COURSE_SUCCESS: "코스 조회 성공",
  READ_PRIVATE_COURSE_SUCCESS: "private 코스 조회 성공",
  NO_COURSE: "존재하지 않는 코스입니다.",
  CREATE_COURSE_SUCCESS: "코스 생성 성공",
  CREATE_COURSE_FAIL: "코스 생성 실패",
  DEPARTURE_VALIDATION_ERROR: "출발지 정보가 유효하지 않습니다.",
  NO_IMAGE: "이미지가 없습니다.",
  DELETE_COURSE_SUCCESS: "코스 삭제 성공",
  DELETE_COURSE_FAIL: "코스 삭제 실패",
  NO_DELETED_COURSE: "삭제할 코스가 존재하지 않습니다.",

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
  DELETE_PUBLIC_COURSE_SUCCESS: "업로드된 코스 삭제 성공",
  DELETE_PUBLIC_COURSE_FAIL: "업로드된 코스 삭제 실패",
  UPDATE_COURSE_SUCCESS: "업로드한 코스 수정 성공",
  NO_DELETED_PUBLIC_COURSE: "삭제할 업로드된 코스가 존재하지 않습니다.",
  READ_PUBLIC_COURSE_FAIL: "업로드된 코스 조회 실패",

  //record
  UPLOAD_RECORD: "경로기록하기 성공",
  INVALID_COURSEID: "유효하지 않은 코스 아이디",
  NO_RECORD_TITLE: "경로 타이틀 없음",
  NO_RECORD_TIME: "경로 뛴 시간 없음",
  NO_RECORD_PACE: "경로 뛴 페이스 없음",
  NO_COURSE_ID: "코스아이디 없음",
  NO_RECORD: "유저의 러닝 기록이 없음",
  READ_RECORD_SUCCESS: "활동 기록 조회 성공",
  UPDATE_RECORD_SUCCESS: "활동 기록 수정 성공",
  NO_RECORD_ID: "존재하지 않는 레코드 아이디입니다.",
  DELETE_RECORD_SUCCESS: "기록 삭제 성공",
  DELETE_RECORD_FAIL: "기록 삭제 실패",

  //scrap
  CREATE_SCRAP_SUCCESS: "코스 스크랩 성공",
  DELETE_SCRAP_SUCCESS: "코스 스크랩 취소 성공",
  INVALID_USER: "유효하지 않은 유저",
  READ_SCRAP_COURSE_SUCCESS: "스크랩한 코스 조회 성공",
  NO_SCRAP_RECORD: "이전에 스크랩한 기록이 없는 public course 입니다.",

  //stamp
  READ_STAMP_BY_USER: "유저가 가진 스탬프 조회 성공",
};
