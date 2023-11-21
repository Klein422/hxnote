import request from "./request";
import note from "../view/note/note";

export function getNotes(id){
  return request.get("/notes/list/"+id);
}

export function createNote(body){
  return request.post("/notes/create",body);
}

export function deleteNote(id){
  return request.delete("/notes/delete/"+id);
}

export function updateNote(id,body){
  return request.put("/notes/update/"+id,body);
}

export function searchNote(key,notebookId){
  return request.get("/notes/search?key="+key+"&notebookId="+notebookId);
}

export function getNoteVersion(noteId){
 return request.get("/notes/version/"+noteId);
}

export function replaceNote(versionId){
  return request.post("/notes/version/"+versionId);
}
