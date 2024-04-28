import { getErrorMessage } from "./utils";
import imageCompression from "browser-image-compression";

export async function uploadToS3(imageFile: File, folder: string) {
  try {
    const { url, fileKey, errorMessage } = await fetch(
      "/api/s3/get-upload-url",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: imageFile.name,
          folder,
        }),
      },
    ).then((res) => res.json());

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    try {
      imageFile = await imageCompression(imageFile, {
        maxSizeMB: 1,
      });
    } catch (error) {
      throw new Error("Image compression failed");
    }

    const uploadResponse = await fetch(url, {
      method: "PUT",
      body: imageFile,
    });

    if (!uploadResponse.ok) {
      throw new Error("Image upload failed");
    }

    const s3ImageUrl = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3-us-west-1.amazonaws.com/${fileKey}`;

    return { s3ImageUrl, errorMessage: null };
  } catch (error) {
    return { errorMessage: getErrorMessage(error) };
  }
}

export async function deleteFromS3(imageUrl: string) {
  try {
    const { url, fileKey, errorMessage } = await fetch(
      "/api/s3/get-delete-url",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl,
        }),
      },
    ).then((res) => res.json());

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    const uploadResponse = await fetch(url, {
      method: "DELETE",
      body: fileKey,
    });

    if (!uploadResponse.ok) {
      throw new Error("Image deletion failed");
    }

    return { errorMessage: null };
  } catch (error) {
    return { errorMessage: getErrorMessage(error) };
  }
}
