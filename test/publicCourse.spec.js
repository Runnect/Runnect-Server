// 아 아래의 테스트 파일은 실행은 되나 패스는 되지 않은 파일임. 그래도 형식을 참고해서 테스트 파일을 작성하면 된다.

import app from "../src/index";
import request from "supertest";
import expect from "chai";
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
