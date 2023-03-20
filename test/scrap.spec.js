import app from "../src/index";
import request from "supertest";
import { expect } from "chai";
import dotenv from "dotenv";
dotenv.config();

describe("POST ~/api/scrap", () => {
  it("코스 스크랩 성공", (done) => {
    request(app)
      .post("/api/scrap") //url
      .set("Content-Type", "application/json") //req.headers
      .set("machineId", process.env.MACHINE_ID)
      .send({
        //request.body
        publicCourseId: process.env.PUBLIC_COURSE_ID,
        scrapTF: true,
      })
      .expect(200) //예측상태코드
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body.message).to.equal("코스 스크랩 성공");
        done();
      })
      .catch((err) => {
        console.error("######에러 >>", err);
        done(err);
      });
  });
  it("코스 스크랩 취소 성공", (done) => {
    request(app)
      .post("/api/scrap") //url
      .set("Content-Type", "application/json") //req.headers
      .set("machineId", process.env.MACHINE_ID)
      .send({
        //request.body
        publicCourseId: process.env.PUBLIC_COURSE_ID,
        scrapTF: false,
      })
      .expect(200) //예측상태코드
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body.message).to.equal("코스 스크랩 취소 성공");

        done();
      })
      .catch((err) => {
        console.error("######에러 >>", err);
        done(err);
      });
  });
  it("필요한값이 없을때", (done) => {
    request(app)
      .post("/api/scrap") //url
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

describe("GET ~/api/scrap/user", () => {
  it("스크랩한 코스 조회 성공", (done) => {
    request(app)
      .get("/api/scrap/user") //url
      .set("Content-Type", "application/json") //req.headers
      .set("machineId", process.env.MACHINE_ID)
      .expect(200) //예측상태코드
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
      .get("/api/scrap/user") //url
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
