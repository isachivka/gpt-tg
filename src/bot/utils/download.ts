import axios from 'axios';
import fs from 'fs';

export async function download(url: string, path: string) {
  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream',
  });

  response.data.pipe(fs.createWriteStream(path));

  return new Promise<void>((resolve, reject) => {
    response.data.on('end', () => {
      resolve();
    });

    response.data.on('error', () => {
      reject();
    });
  });
}
