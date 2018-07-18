
importScripts('../turf/turf.min.js');
onmessage = function (e) {
    var opt = e.data;
    var points = turf.along(opt.line, opt.dis, opt.u);
    postMessage(points)
}