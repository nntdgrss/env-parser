import dotenv from "dotenv";
import { parseStringFromEnv } from "..";

dotenv.config();

function firstTest() {
  console.log("Try to get an non-undefined value:", parseStringFromEnv("TEST"));
}

function secondTest() {
  console.log("Try to get an undefined value:", parseStringFromEnv("TEST2"));
}

firstTest();

try {
  secondTest();
} catch (error: Error | any) {
  console.log("Error:", error.message);
}
