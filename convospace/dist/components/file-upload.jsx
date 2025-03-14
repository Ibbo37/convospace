"use client";
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";
const FileUpload = ({ endpoint, onChange, value, }) => {
    const fileType = value.split(".").pop();
    if (value && fileType !== "pdf") {
        return (<div className="relative h-20 w-20">
        <Image fill src={value} alt="Uploaded Image" className="rounded-full"/>
        <button title="Remove upload image " onClick={() => onChange("")} className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm" type="button">
          <X className="h-4 w-4"/>
        </button>
      </div>);
    }
    if (value && fileType === "pdf") {
        return (<div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400"/>
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-indigo-400 text-sm ml-2 dark:text-indigo-300 hover:underline">
          {value}
        </a>
        <button onClick={() => onChange("")} className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm" type="button">
          Remove <X className="h-4 w-4"/>
        </button>
      </div>);
    }
    return (<UploadDropzone endpoint={endpoint} onClientUploadComplete={(res) => {
            onChange(res?.[0].fileUrl);
        }} onUploadError={(error) => console.log(error)}/>);
};
export default FileUpload;
