export const validation = {};

validation.validateService = (value) => {
return value !== "";
};

validation.validateEmail = (value) => {
const emailRegex = /^\S+@\S+\.\S+$/;
return emailRegex.test(value);
};

validation.validDate = (value) => {
let formdate = new Date(value);
let todayDate = new Date();

return formdate > todayDate;
};