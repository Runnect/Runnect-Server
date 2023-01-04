import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createStampByUser = async (machineId: string, option: string) => {
   

};

const stampService = {
    createStampByUser,
};
  
export default stampService;