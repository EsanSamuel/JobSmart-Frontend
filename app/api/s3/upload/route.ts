import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidu4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../../../libs/s3Client";

const uploadRequestSchema = z.object({
  fileName: z.string(),
  contentType: z.string(),
  size: z.number(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = uploadRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request bosy" },
        { status: 400 }
      );
    }

    const { contentType, fileName, size } = validation.data;
    const uniqueKey = `${uuidu4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: uniqueKey,
      ContentType: contentType,
      ContentLength: size,
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 360 });
    const permanentUrl = `https://${process.env.S3_BUCKET_NAME}.t3.storage.dev/${uniqueKey}`;

    const response = {
      presignedUrl,
      permanentUrl,
      key: uniqueKey,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
