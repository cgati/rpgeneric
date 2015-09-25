function toImage(returnType) {
    var dataURL = document.getElementById('canvas').toDataURL("image/png");
    switch (returnType) {
        case 'obj':
            var imgObj = new Image();
            imgObj.src = dataURL;
            document.getElementById('graphics').appendChild(imgObj);
            break;
        case 'window':
            window.open(dataURL, "Canvas Image");
            break;
        case 'download':
            dataURL = dataURL.replace("image/png", "image/octet-stream");
            document.location.href = dataURL;
            break;
    }
}
