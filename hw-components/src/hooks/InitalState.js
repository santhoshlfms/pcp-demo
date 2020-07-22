import { uuid } from "uuidv4";
import Chance from "chance";

let chance = new Chance();

export const INITIALSTATE = {
  //PP
   //username:"restapiuser@47164691611",
   //password: "Pp12345678!",
  
  // DIRECT
  username: "restapiuser@33086521615",
  password: "Test@123456",
  programToken: "prg-a4f57e52-a848-42bd-9b53-250102c4eac2",
  
  profileType: "INDIVIDUAL",
  clientUserId: `${uuid()}`,
  firstName: "John",
  middleName: "",
  lastName: "Doe",
  email: chance.email({ domain: "test.com" }),
  dateOfBirth: "1990-03-03",
  addressLine1: "1st Lane street",
  addressLine2: "",
  city: "New Jersey",
  postalCode: "10016",
  stateProvince: "NY",
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
  //parentToken: "prg-db4977a4-5e2d-477f-b17d-dabca7a18b93",
};
export const getInitalState = () => ({
  ...INITIALSTATE,
  clientUserId: `${uuid()}`,
  email: chance.email({ domain: "test.com" }),
  clientPaymentId: `${uuid()}`,
});
