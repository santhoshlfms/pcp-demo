import { uuid } from "uuidv4";
import Chance from "chance";

let chance = new Chance();

export const INITIALSTATE = {
  //PP
   //username:"restapiuser@47164691611",
   //password: "Pp12345678!",
  
  // DIRECT
  username: "restapiuser@47164771611",
  password: "Pp123456789!",
  programToken: "prg-e74fb339-7b4e-44de-a278-89e5f63523e0",
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

  userToken: "",

  destinationToken: "",
  clientPaymentId: `${uuid()}`,
  amount: "10",
  currency: "USD",
  purpose: "GP0005",

  //PP
  //parentToken: "prg-e26409f3-ec79-4746-908b-b2398f001574",
  
  // DIRECT
  programToken: "prg-e74fb339-7b4e-44de-a278-89e5f63523e0",
};
export const getInitalState = () => ({
  ...INITIALSTATE,
  clientUserId: `${uuid()}`,
  email: chance.email({ domain: "test.com" }),
  clientPaymentId: `${uuid()}`,
});
