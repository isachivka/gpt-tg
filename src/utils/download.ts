import axios from "axios";
import fs, { createReadStream } from "fs";
import path from "path";
import process from "process";

export async function downloadImage(url: string, path: string) {
  const response = await axios({
    method: "GET",
    url: url,
    responseType: "stream",
  });

  response.data.pipe(fs.createWriteStream(path));

  return new Promise<void>((resolve, reject) => {
    response.data.on("end", () => {
      resolve();
    });

    response.data.on("error", () => {
      reject();
    });
  }).then(() => {
    return createReadStream(path) as any;
  });
}

export function getPaths(id: number) {
  const filename = `${id}.png`;
  const filenameMask = `${id}_mask.png`;
  const directory = path.join(process.cwd(), "./");
  const filePath = `${directory}${filename}`;
  const filePathMask = `${directory}${filenameMask}`;
  return {
    filePath,
    filePathMask,
  };
}

export function removeFiles(files: { filePath: string; filePathMask: string }) {
  fs.unlink(files.filePath, (err) => {
    if (err) console.error(err);
  });
  fs.unlink(files.filePathMask, (err) => {
    if (err) console.error(err);
  });
}