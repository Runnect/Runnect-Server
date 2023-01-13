import app from "../src/index";
import request from "supertest";
import { expect } from "chai";
import dotenv from "dotenv";
dotenv.config();

const randomMachineId = Math.random()
  .toString(36)
  .substring(2, 11);

const randomNickname1 = Math.random()
  .toString(36)
  .substring(2, 11);

const randomNickname2 = Math.random()
  .toString(36)
  .substring(2, 11);

//* signUp
describe("POST ~/api/user", () => {
  it("회원 가입 성공", (done) => {
    request(app)
      .post("/api/user") //url
      .set("Content-Type", "application/json") //req.headers
      .set("machineId", randomMachineId)
      .send({
        //request.body
        nickname: randomNickname1,
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
      .post("/api/user") //url
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

//* getUser
describe("GET ~/api/user", () => {
  it("유저 조회 성공", (done) => {
    request(app)
      .get("/api/user") //url
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
      .get("/api/user") //url
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

//* updateUserNickname
describe("PATCH ~/api/user", () => {
  it("유저 수정 성공", (done) => {
    request(app)
      .patch("/api/user") //url
      .set("Content-Type", "application/json") //req.headers
      .set("machineId", process.env.MACHINE_ID)
      .send({
        //request.body
        nickname: randomNickname2,
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
      .patch("/api/user") //url
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
