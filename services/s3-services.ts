import AWS, { S3 } from 'aws-sdk';
import { convertFileName } from 'functions';

AWS.config.update({
  region: 'ap-northeast-2',
  accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_KEY,
});

const s3 = new S3({
  region: 'ap-northeast-2',
  accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_KEY,
});

type SendMailProps = {
  senderEmail?: string;
  receiverEmail: string | string[];
  title: string;
  content: string;
};

const s3Services = {
  uploadFile: async (file: File, fileDelete?: string) => {
    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET as string,
      Key: 'noithatso/' + new Date().valueOf() + '/' + convertFileName(file.name),
      Body: file,
      ContentType: file.type,
    };
    const { Location } = await s3
      .upload(params)
      .promise()
      .then(async (res) => {
        if (fileDelete) s3Services.deleteFile(fileDelete);
        return res;
      });

    return 'https://resources.archisketch.com/' + Location.split('.amazonaws.com/')[1];
  },

  deleteFile: async (fileDelete: string | string[]) => {
    const deleteList: string[] = typeof fileDelete === 'string' ? [fileDelete] : fileDelete;
    deleteList.forEach(async (link) => {
      if (link) {
        const params = {
          Bucket: process.env.NEXT_PUBLIC_S3_BUCKET as string,
          Key: link.split('.amazonaws.com/')[1] || link.split('resources.archisketch.com/')[1],
        };
        await s3.deleteObject(params).promise();
      }
    });
  },

  sendMail: async (body: SendMailProps) => {
    const { senderEmail, receiverEmail, title, content } = body;
    const params = {
      Destination: { ToAddresses: typeof receiverEmail === 'string' ? [receiverEmail] : receiverEmail },
      Message: {
        Body: { Html: { Charset: 'UTF-8', Data: content } },
        Subject: { Charset: 'UTF-8', Data: title },
      },
      Source: senderEmail || 'marketing@noithatso.com.vn',
      ReplyToAddresses: ['marketing@noithatso.com.vn'],
    };
    const sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
    await sendPromise;
  },
};

export default s3Services;
