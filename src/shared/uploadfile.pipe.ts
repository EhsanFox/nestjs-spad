import { ParseFilePipeBuilder } from "@nestjs/common";
export const UploadFilePipe = (isRequired = true) =>
    new ParseFilePipeBuilder()
        .addFileTypeValidator({
            fileType: /(jpg|jpeg|png|gif)/,
        })
        .build({ fileIsRequired: isRequired });
