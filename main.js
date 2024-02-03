const child_process = require("child_process");
const config = require("./config");
const path = require("path");

main();

function main() {
    console.log("Starting JavaJS v" + require("./package.json").version);

    let configError = false;

    if (config.java_path == null || config.java_path === "") {
        console.error("[java/error]: Missing value for \"java_path\" !");
        configError = true;
    }

    if ((config.jar_file == null || config.jar_file === "") && config.execute_jar) {
        console.error("[java/error]: Value required for \"jar_file\" because \"execute_jar\" is set to true !");
        configError = true;
    }

    if ((config.class_file == null || config.class_file === "") && !config.execute_jar) {
        console.error("[java/error]: Value required for \"class_file\" because \"execute_jar\" is set to false !");
        configError = true;
    }

    if (configError) process.exit(1);

    if (config.execute_jar) execute_jar();
    else execute_class();
}

function execute_jar() {
    console.log("Executing: " + config.java_path + path.sep + "bin" + path.sep + "java -jar " + config.jar_file);

    const child = child_process.exec(config.java_path + path.sep + "bin" + path.sep + "java -jar " + config.jar_file);

    child.stdout.on("data", (data) => {
        console.log("[java]: " + data);
    });

    child.stderr.on("data", (data) => {
        console.error("[java/error]: " + data);
    });
}

function execute_class() {
    console.log("Executing: " + config.java_path + path.sep + "bin" + path.sep + "java " + config.class_file);

    const child = child_process.exec(config.java_path + path.sep + "bin" + path.sep + "java " + config.class_file);

    child.stdout.on("data", (data) => {
        console.log("[java]: " + data);
    });

    child.stderr.on("data", (data) => {
        console.error("[java/error]: " + data);
    });
}
