const fs = require("fs");
const archiver = require("archiver");
const path = require("path");
const { exec, execSync } = require("child_process");
const config = {
  // 打包后产物路径
  buildPath: path.resolve("./dist"),
  serviceUser: "root@47.116.167.180",
  serviceFilePath: "/opt/",
};

// 在本地压缩文件
const compressFile = () => {
  return new Promise((resolve, reject) => {
    console.log("压缩打包产物...");
    const zipFilePath = path.resolve("./", "go2-service.zip");
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(output);
    archive.directory(config.buildPath, false);
    archive.finalize();
    output.on("close", function () {
      console.log("压缩完成");
      fs.access(zipFilePath, fs.constants.F_OK, (err) => {
        if (err) {
          reject("压缩文件不存在。");
        } else {
          console.log(
            `压缩完毕,压缩包大小:${(archive.pointer() / 1024 / 1024).toFixed(
              1
            )}MB`
          );
          resolve();
        }
      });
    });
    output.on("warning", function (msg) {
      console.log("warning", msg);
      // resolve()
    });
    output.on("end", function () {
      console.log("压缩end");
    });
    archive.on("error", function (err) {
      reject(err);
    });
  });
};
const execPro = (execstr) => {
  return new Promise((resolve, reject) => {
    exec(execstr, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      console.log(`执行成功${execstr}`);
      console.log(stdout);
      resolve(stdout);
    });
  });
};
const deleteOutput = () => {
  return new Promise((resolve, reject) => {
    fs.unlink("./go2-service.zip", (err) => {
      if (err) {
        reject("node删除失败");
        console.log(err);
        return;
      } else {
        resolve();
      }
    });
  });
};
const checkBranch = async () => {
  const gitBranch = await execPro("git rev-parse --abbrev-ref HEAD");
  if (!gitBranch.includes("dev-1.0")) throw new Error("请切换到dev分支");
};
const init = async () => {
  try {
    // await checkBranch()
    await compressFile();
    // 上传服务器

    await execPro(
      `scp ./go2-service.zip ${config.serviceUser}:${config.serviceFilePath}`
    );
    // await execPro(
    //   `ssh ${config.serviceUser} bash /opt/fdsec/extract.sh ${config.serviceFilePath}`
    // );
    // 删除原来的文件
    // await deleteOutput();
    console.log("上传完成");
  } catch (err) {
    console.error(err);
  }
};

init();
