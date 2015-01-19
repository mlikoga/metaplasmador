/**
 * Created by MLK on 08/11/2014.
 */

function getFileFromServer(url, doneCallback, doneCallbackArgs) {
    var xhr;

    xhr = new XMLHttpRequest();
    xhr.onload = reqListener;
    xhr.open("GET", url, true);
    xhr.send();


    function reqListener() {
        doneCallback(this.responseText, doneCallbackArgs);
    }
}