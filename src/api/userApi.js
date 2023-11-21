import request from './request';

export function loginByUsername(username,password){
  return request.post("/users/login",{username,password});
}

export function sendVerificationCode(email){
  return request.get("/users/verificationCode", {params:{email:email}});
}

export function registerUser(email,username,password,verificationCode){
  return request.put("/users/register",{username,password,email,verificationCode});
}
