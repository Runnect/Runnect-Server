import app from "../src/index";
import request from "supertest";
import expect from "chai";
import dotenv from "dotenv";
dotenv.config();


//* getCourseDetail
describe("GET ~/api/course/detail/:courseId", () => {
    it("코스 조회 성공", (done) => {
      request(app)
        .get("/api/course/detail/25") //url
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
        .get("/api/course/detail/25") //url
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
