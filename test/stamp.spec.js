import app from "../src/index";
import request from "supertest";
import { expect } from "chai";
import dotenv from "dotenv";
dotenv.config();

describe("GET ~/api/stamp/user", () => {
  it("유저가 가진 스탬프 조회 성공", (done) => {
    request(app)
      .get("/api/stamp/user") //url
      .set("Content-Type", "application/json") //req.headers
      .set("machineId", process.env.MACHINE_ID)
      .expect(200) //예측상태코드
      .expect("Content-Type", /json/)
      .then((res) => {
        //response body 예측값
        expect(res.body.message).to.equal("유저가 가진 스탬프 조회 성공");
        expect(res.body.data.user.machineId).to.equal(process.env.MACHINE_ID);
        expect(res.body.data.stamps).not.to.be.null;
        done();
      })
      .catch((err) => {
        console.error("######에러 >>", err);
        done(err);
      });
  });
  it("필요한값이 없을때", (done) => {
    request(app)
      .get("/api/stamp/user") //url
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
