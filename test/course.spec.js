import app from "../src/index";
import request from "supertest";
import expect from "chai";
import dotenv from "dotenv";
import image from "./test_img/test_image.jpg";
dotenv.config();

const data = `{"path":[{"lat":"33.33", "long":"33.33"},{"lat":"33.33", "long":"33.33"}], "distance" :"33.3","departureAddress":"서울 종로구 익선동 12", "departureName": "익선동빌딩"}`;

//* createCourse
describe("POST ~/api/course", () => {
    it("코스 생성 성공", (done) => {
      request(app)
        .post("/api/course") //url
        .field("Content-Type", "multipart/form-data") //req.headers
        .field("machineId", process.env.MACHINE_ID)
        .field("data", './test_img/test_image.jpg')
        .attach("image", image) 
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
        .post("/api/course") //url
        .field("Content-Type", "multipart/form-data") //req.headers
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

//* getCourseByUser
describe("GET ~/api/course/user", () => {
    it("코스 조회 성공", (done) => {
      request(app)
        .get("/api/course/user") //url
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
        .get("/api/course/user") //url
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

//* getPrivateCourseByUser
describe("GET ~/api/course/private/user", () => {
    it("private 코스 조회 성공", (done) => {
      request(app)
        .get("/api/course/private/user") //url
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
        .get("/api/course/private/user") //url
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
