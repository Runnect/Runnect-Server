import app from "../src/index";
import { expect } from "chai";
import supertest from "supertest";
import dotenv from "dotenv";
import { request } from "http";

dotenv.config();



describe("POST ~/api/public-course", ()=>{
    it("코스 업로드 성공",(done)=>{
        request(app)
          .post("/api/public-course")
          .set("Content-Type", "application/json")
          .set("machineId", process.env.MACHINE_ID)
          .send({
            "courseId" : ,
            "title" : ,
            "description",
          })
          .expect(200)
          .expect("Content-Type", /json/)
          .then((res) => {
            expect(res.body.data.nickname).to.equal("jobchae");
            expect(res.body.data.totalContentNumber).to.equal(9);
            expect(res.body.data.totalCategoryNumber).to.equal(6);
            expect(res.body.data.totalSeenContentNumber).to.equal(1);
            done();
          })
          .catch((err) => {
            console.error("######Error >>", err);
            done(err);
          });
    });
});
