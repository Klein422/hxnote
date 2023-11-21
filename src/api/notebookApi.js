import request from "./request";

export function getNotebooks() {
  return request.get("/notebooks/list");
}

export function delNotebook(id){
  return request.delete("/notebooks/delete/"+id);
}

export function createNotebook(body){
  return request.post("/notebooks/create",body);
}

export function editNotebook(id,body){
  return request.post("/notebooks/update/"+id,body);
}
