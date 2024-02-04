const child_process = require("child_process");
const config = require("./config");
const path = require("path");

main();

function main() {
    console.log("[javajs/info] Starting JavaJS v" + require("./package.json").version);

    let configError = false;

    if (config.java_path == null || config.java_path === "") {
        console.error("[javajs/error]: Missing value for \"java_path\" !");
        configError = true;
    }

    if ((config.jar_file == null || config.jar_file === "") && config.execute_jar) {
        console.error("[javajs/error]: Value required for \"jar_file\" because \"execute_jar\" is set to true !");
        configError = true;
    }

    if ((config.class_file == null || config.class_file === "") && !config.execute_jar) {
        console.error("[javajs/error]: Value required for \"class_file\" because \"execute_jar\" is set to false !");
        configError = true;
    }

    if (configError) process.exit(1);

    if (config.execute_jar) execute_jar();
    else execute_class();
}

function execute_jar() {
    console.log("[javajs/info] Executing: " + config.java_path + path.sep + "bin" + path.sep + "java -jar " + config.jar_file);

    const child = child_process.exec(config.java_path + path.sep + "bin" + path.sep + "java -jar " + config.jar_file);

    child.stdout.on("data", (data) => console.log("[java/info]: " + data));

    child.stderr.on("data", (data) => console.error("[java/error]: " + data));

    child.on("exit", (code) => {
        console.log("[javajs/info] Java process ended with code " + code + "!");
        process.exit(0);
    });

    startScanner(child.stdin);
}

function execute_class() {
    console.log("[javajs/info] Executing: " + config.java_path + path.sep + "bin" + path.sep + "java " + config.class_file);

    const child = child_process.exec(config.java_path + path.sep + "bin" + path.sep + "java " + config.class_file);

    child.stdout.on("data", (data) => console.log("[java]: " + data));

    child.stderr.on("data", (data) => console.error("[java/error]: " + data));

    child.on("exit", (code) => {
        console.log("[javajs/info] Java process ended with code " + code + "!");
        process.exit(0);
    });

    startScanner(child.stdin);
}

function startScanner(stdin) {
    process.stdin.on("data", (data) => {
        console.log("[javajs/info] Redirecting your input to java process");

        stdin.write(data);
    });
}