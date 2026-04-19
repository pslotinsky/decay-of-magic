import { z } from 'zod';
import { S3 } from '@aws-sdk/client-s3';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { FileDto, FileSchema } from '@dod/api-contract';

import { File } from '@/lore/file.entity';

const env = z
  .object({
    PUBLIC_ENDPOINT: z.url(),
    S3_ENDPOINT: z.url(),
    S3_REGION: z.string().min(1),
    S3_BUCKET: z.string().min(1),
    S3_ACCESS_KEY: z.string().min(1),
    S3_SECRET_KEY: z.string().min(1),
  })
  .parse(process.env);

export class UploadFileCommand extends Command<FileDto> {
  constructor(public file: File) {
    super();
  }
}

@CommandHandler(UploadFileCommand)
export class UploadFileUseCase implements ICommandHandler<
  UploadFileCommand,
  FileDto
> {
  private readonly client = new S3({
    forcePathStyle: true,
    endpoint: env.S3_ENDPOINT,
    region: env.S3_REGION,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY,
      secretAccessKey: env.S3_SECRET_KEY,
    },
  });

  public async execute({ file }: UploadFileCommand): Promise<FileDto> {
    await this.client.putObject({
      Bucket: env.S3_BUCKET,
      Key: this.createPath(file),
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: { id: file.id, name: file.name },
    });

    return FileSchema.parse({ ...file, url: this.createAbsolutePath(file) });
  }

  private createPath(file: File): string {
    return `${file.category}/${file.id}/${file.name}`;
  }

  private createAbsolutePath(file: File): string {
    return `${env.PUBLIC_ENDPOINT}/${env.S3_BUCKET}/${this.createPath(file)}`;
  }
}
