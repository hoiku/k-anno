import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, content } = req.body
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: name,
      Body: Buffer.from(content, 'base64'),
      ContentType: 'image/png'
    }
    await s3.send(new PutObjectCommand(params))
    res.status(200).json({ message: 'Uploaded successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Upload failed' })
  }
}
