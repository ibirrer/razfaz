var config = module.exports;

config["browser"] = {
    env: "browser", 
    rootPath: "../",
    sources: [
        "lib/template.js",
        "www/js/vendor/jquery-1.8.3.min.js"
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