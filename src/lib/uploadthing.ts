import { OurFileRouter } from "@/app/api/uploadthing/core";
import {generateUploadButton} from '@uploadthing/react'
import { generateUploadDropzone } from "@uploadthing/react";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();