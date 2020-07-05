import { uuid } from "uuidv4";
import Chance from "chance";

let chance = new Chance();

export const INITIALSTATE = {
  username: "restapiuser@47164691611",
  password: "Pp12345678!",
  programToken: "prg-be37583f-2c75-4dd6-9c26-eec2b4cafccf",

  profileType: "INDIVIDUAL",
  clientUserId: `${uuid()}`,
  firstName: "John",
  lastName: "Doe",
  email: chance.email({ domain: "test.com" }),
  dateOfBirth: "1990-03-03",
  addressLine1: "1st Lane street",
  city: "San Jose",
  postalCode: "65001",
  stateProvince: "California",
  country: "US",

  userToken: "usr-a7ea5be7-37a4-4430-be59-b8223f2e6663",
  destinationToken: "trm-f299cffe-ca3f-44fc-ad65-d2403aea3ec0",
  clientPaymentId: `${uuid()}`,
  amount: "10",
  currency: "USD",
  purpose: "GP0005",
};
