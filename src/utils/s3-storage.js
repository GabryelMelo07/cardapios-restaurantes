import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    },
    region: process.env.BUCKET_REGION
});

async function uploadS3(file) {
    const bucketName = process.env.BUCKET_NAME;
    const fileKey = `${Date.now()}_${file.originalname}`;
    
    const params = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype
    });

    await client.send(params);
    const imageUrl = `https://${bucketName}.s3.amazonaws.com/${fileKey}`;
    return imageUrl;
}

export { uploadS3 };