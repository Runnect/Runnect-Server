import app from "../src/index";
import request from "supertest";
import { expect } from "chai";
import dotenv from "dotenv";
dotenv.config();

describe("POST ~/api/public-course", () => {
  it("코스 업로드 성공", (done) => {
    request(app)
      .post("/api/public-course") //url
      .set("Content-Type", "application/json") //req.headers
      .set("machineId", process.env.MACHINE_ID)
      .send({
        //request.body
        courseId: process.env.COURSE_ID,
        title: "mocha test1",
        description: "mocha test1",
      })
      .expect(201) //예측상태코드
      .expect("Content-Type", /json/)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error("######에러 >>", err);
        done(err);
      });
  });
  it("필요한값이 없을때", (done) => {
    request(app)
      .post("/api/public-course") //url
      .set("Content-Type", "application/json") //req.headers
      .expect(400)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error("######에러 >>", err);
        done(err);
      });
  });
});

describe("GET ~/api/public-course/user", () => {
  it("유저 업로드한 코스 조회 성공", (done) => {
    request(app)
      .get("/api/public-course/user") //url
      .set("Content-Type", "application/json") //req.headers
      .set("machineId", process.env.MACHINE_ID)
      .expect(200) //예측상태코드
      .expect("Content-Type", /json/)
      .then((res) => {
        //response body 예측값
        expect(res.body.data.user.machineId).to.equal(process.env.MACHINE_ID);
        expect(res.body.data.publicCourses).not.to.be.null;

        done();
      })
      .catch((err) => {
        console.error("######에러 >>", err);
        done(err);
      });
  });
  it("필요한값이 없을때", (done) => {
    request(app)
      .get("/api/public-course/user") //url
      .set("Content-Type", "application/json") //req.headers
      .expect(400)
      .then((res) => {
        expect(res.body.message).to.equal("기기넘버가 없습니다.");
        done();
      })
      .catch((err) => {
        console.error("######에러 >>", err);
        done(err);
      });
  });
});

describe("GET ~/api/public-course/detail/:publicCourseId", () => {
  it("업로드 코스 상세 조회 성공", (done) => {
    request(app)
      .get(`/api/public-course/detail/${process.env.PUBLIC_COURSE_ID}`) //url
      .set("Content-Type", "application/json") //req.headers
      .set("machineId", process.env.MACHINE_ID)
      .expect(200) //예측상태코드
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body.data.user).not.to.be.null;

        expect(res.body.data.publicCourses).not.to.be.null;

        expect(res.body.data.publicCourse.id).to.equal(Number(process.env.PUBLIC_COURSE_ID));

        done();
      })
      .catch((err) => {
        console.error("######에러 >>", err);
        done(err);
      });
  });
  it("필요한값이 없을때", (done) => {
    request(app)
      .get(`/api/public-course/detail/${process.env.PUBLIC_COURSE_ID}`) //url
      .set("Content-Type", "application/json") //req.headers
      .expect(400)
      .then((res) => {
        expect(res.body.message).to.equal("기기넘버가 없습니다.");

        done();
      })
      .catch((err) => {
        console.error("######에러 >>", err);
        done(err);
      });
  });
});

describe("GET ~/api/public-course", () => {
  it("추천 코스 조회 성공", (done) => {
    request(app)
      .get("/api/public-course") //url
      .set("Content-Type", "application/json") //req.headers
      .set("machineId", process.env.MACHINE_ID)
      .expect(200) //예측상태코드
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body.message).to.equal("추천 코스 조회 성공");
        expect(res.body.data.publicCourses).not.to.be.null;
        done();
      })
      .catch((err) => {
        console.error("######에러 >>", err);
        done(err);
      });
  });

  it("필요한값이 없을때", (done) => {
    request(app)
      .get("/api/public-course") //url
      .set("Content-Type", "application/json") //req.headers
      .expect(400)
      .then((res) => {
        expect(res.body.message).to.equal("기기넘버가 없습니다.");

        done();
      })
      .catch((err) => {
        console.error("######에러 >>", err);
        done(err);
      });
  });
});

describe(`GET ~/api/public-course/search?keyword=${process.env.SEARCH_KEYWORD}`, () => {
  it("업로드된 코스 검색 성공", (done) => {
    request(app)
      .get(`/api/public-course/search?keyword=${process.env.SEARCH_KEYWORD}`) //url
      .set("Content-Type", "application/json") //req.headers
      .set("machineId", process.env.MACHINE_ID)
      .expect(200) //예측상태코드
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body.message).to.equal("업로드된 코스 검색 성공");
        expect(res.body.data).not.to.be.null;
        done();
      })
      .catch((err) => {
        console.error("######에러 >>", err);
        done(err);
      });
  });

  it("필요한값이 없을때", (done) => {
    request(app)
      .get(`/api/public-course/search?keyword=${process.env.SEARCH_KEYWORD}`) //url
      .set("Content-Type", "application/json") //req.headers
      .expect(400)
      .then((res) => {
        expect(res.body.message).to.equal("기기넘버가 없습니다.");

        done();
      })
      .catch((err) => {
        console.error("######에러 >>", err);
        done(err);
      });
  });
});
