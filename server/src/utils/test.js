const url ="https://res.cloudinary.com/gautamcloudinary/raw/upload/v1781878837/UserNotes/nr8lubdbtewwvcfa0s8v.png";
const parts=url.split("/upload/")[1];
const public_id = parts.split("/").slice(1).join("/");
