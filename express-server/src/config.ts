import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 9090;

export const config = {
  server: {
    port: PORT,
  },
};
