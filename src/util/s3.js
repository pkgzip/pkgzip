import AWS from 'aws-sdk';
import { TIMER_S3_UPLOAD, TIMER_S3_DOWNLOAD, timeStart, timeEnd } from './timer-keys';
import log from './logger';

// bucket/region hard coded due to cloudformation not exposing generated name
const S3_BUCKET = 'morty-dev-jscache-fktj6ok81p5z';
const S3_REGION = 'ap-southeast-2';

function newS3() {
  return new AWS.S3({
    region: S3_REGION,
  });
}

function upload(filename, contents) {
  timeStart(TIMER_S3_UPLOAD);
  return new Promise((resolve, reject) => {
    newS3().putObject({
      Bucket: S3_BUCKET,
      Key: filename,
      Body: contents,
    }, (err) => {
      timeEnd(TIMER_S3_UPLOAD);
      if (err) {
        log(`Got error uploading '${filename}' to S3. ${JSON.stringify(err)}`);
        reject(err);
        return;
      }
      log(`Uploaded '${filename}' to S3`);
      resolve();
    });
  });
}

function download(filename) {
  timeStart(TIMER_S3_DOWNLOAD);
  return new Promise((resolve, reject) => {
    newS3().getObject({
      Bucket: S3_BUCKET,
      Key: filename,
    }, (err, data) => {
      timeEnd(TIMER_S3_DOWNLOAD);
      if (err || process.env.FROG_CACHE_DISABLED) {
        log(`No cache found for '${filename}'`, err);
        reject(err);
        return;
      }
      log(`Downloaded cached '${filename}' from S3`, filename, err);
      resolve(data.Body.toString('utf-8'));
    });
  });
}

export { upload, download };
