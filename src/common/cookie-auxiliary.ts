export function setCookie(cname, cvalue, exminutes) {
    let d = new Date();
    d.setTime(d.getTime() + (exminutes * 60 * 1000));
    const expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';';
}

export function getCookie(cname) {
    const name = cname + '=';
    const ca = document.cookie.split(';');
    for (let c of ca) {
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}