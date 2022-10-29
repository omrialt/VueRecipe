import bcrypt from "bcrypt";
const users = [
  {
    name: "עומרי אלטרס",
    email: "omrialt@gmail.com",
    password: bcrypt.hashSync("Omri0908!", 12),
    isAdmin: true,
  },
  {
    name: "ישראל ישראלי",
    email: "user@example.com",
    password: bcrypt.hashSync("Jd!12345", 12),
    isAdmin: false,
  },
];
export default users;
