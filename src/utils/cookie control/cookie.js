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