let params = {};
location.search.slice(1).split("&").forEach(param => {
    let set = param.split("=");
    params[set[0]] = set[1];
});
setInterval(() => {postMessage(params.cb);}, params.ms);