import request from "./request";

export function uploadFile(){
  return request.post("/notePicture/upload");
}
