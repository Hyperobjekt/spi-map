import AWS from 'aws-sdk';

// AWS.config.update({
//   accessKeyId: config.AWS_ACCESS_KEY_ID,
//   secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
//   region: config.AWS_REGION,
// });

export const getS3Object = async (url) => {
  try {
    // const { Body } = await s3
    //   .getObject({
    //     Bucket: config.AWS_S3_BUCKET_NAME,
    //     Key: getS3KeyFromObjectUrl(url),
    //   })
    //   .promise();
    // return 'data:image/png;base64,' + Body.toString('base64');
  } catch (error) {
    // throw new Error(error.message);
    console.error(error.message);
  }
};
