import { getUser } from "@/lib/auth";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

// delete-image
export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) throw new Error("Must be logged in to upload an image");

    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Proper image data not provided" },
        { status: 400 },
      );
    }

    const fileKey = imageUrl.split(
      `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3-us-west-1.amazonaws.com/`,
    )[1];

    const s3: any = new S3Client({
      region: "us-west-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const command: any = new DeleteObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      Key: fileKey,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 });

    return NextResponse.json(
      {
        url,
        fileKey,
        errorMessage: null,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { errorMessage: "Failed to generate deletion url" },
      { status: 500 },
    );
  }
}
