import axios from "axios";
import fs from "fs";

export async function downloadImage(url: string, path: string) {
  // axios image download with response type "stream"
  const response = await axios({
    method: "GET",
    url: url,
    responseType: "stream",
  });

  // pipe the result stream into a file on disc
  response.data.pipe(fs.createWriteStream(path));

  // return a promise and resolve when download finishes
  return new Promise<void>((resolve, reject) => {
    response.data.on("end", () => {
      resolve();
    });

    response.data.on("error", () => {
      reject();
    });
  });
}
