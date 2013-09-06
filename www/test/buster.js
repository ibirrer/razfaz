var config = module.exports;

config["browser"] = {
    env: "browser", 
    rootPath: "../",
    sources: [
        "js/vendor/jquery-1.8.3.min.js",
        "js/shims.js",
        "lib/template.js"
    ],
    tests: [
        "test/*-test.js"
    ]
};


config["node"] = {
    env: "node", 
    rootPath: "../",
    tests: [
        "test/*-test.js"
    ]
};