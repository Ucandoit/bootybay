import axios from 'axios';
import { createWriteStream } from 'fs';
import { finished } from 'stream';
import { promisify } from 'util';

export function downloadFile(fileUrl: string, outputLocationPath: string): Promise<any> {
  const finishedPromise = promisify(finished);
  const writer = createWriteStream(outputLocationPath);
  return axios
    .get(fileUrl, {
      responseType: 'stream'
    })
    .then((response) => {
      response.data.pipe(writer);
      return finishedPromise(writer);
    });
}
