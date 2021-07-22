export const ConnectionURL = "http://192.168.0.191:3000/";
//export const ConnectionURL = "localhost:3000/";
export const NotesApi = ConnectionURL+"api/notes/";
export const UsersApi = ConnectionURL+"api/users/";

export function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : "";
}

export function setCookie(name, value){
    document.cookie=name+"="+value;
}

export function delCookie(name){
    document.cookie=name+"=''; max-age=0"
}