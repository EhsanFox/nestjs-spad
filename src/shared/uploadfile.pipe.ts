import { ParseFilePipeBuilder } from "@nestjs/common";
export const UploadFilePipe = new ParseFilePipeBuilder()
    .addFileTypeValidator({
        fileType: /(jpg|jpeg|png|gif)/,
    })
    .build({ fileIsRequired: true });
