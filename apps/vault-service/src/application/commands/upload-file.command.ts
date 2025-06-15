import { S3 } from '@aws-sdk/client-s3';
import { BadRequestException } from '@nestjs/common';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { File } from '@service/domain/file.entity';

const {
  PUBLIC_ENDPOINT,
  S3_ENDPOINT,
  S3_REGION,
  S3_BUCKET,
  S3_ACCESS_KEY,
  S3_SECRET_KEY,
} = process.env;

export class UploadFileCommand extends Command<string> {
  constructor(public file: File) {
    super();
  }
}

@CommandHandler(UploadFileCommand)
export class UploadFileUseCase
  implements ICommandHandler<UploadFileCommand, string>
{
  private bucket: string;
  private client: S3;

  constructor() {
    this.bucket = this.createBucket();
    this.client = this.createClient();
  }

  public async execute({ file }: UploadFileCommand): Promise<string> {
    await this.client.putObject({
      Bucket: this.bucket,
      Key: this.createPath(file),
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: { id: file.id, name: file.name },
    });

    return this.createAbsolutePath(file);
  }

  private createPath(file: File): string {
    return `${file.category}/${file.id}/${file.name}`;
  }

  private createAbsolutePath(file: File): string {
    const path = this.createPath(file);

    return `${PUBLIC_ENDPOINT}/${S3_BUCKET}/${path}`;
  }

  private createBucket(): string {
    if (!S3_BUCKET) {
      throw new BadRequestException('S3_BUCKET is undefined');
    }

    return S3_BUCKET;
  }

  private createClient(): S3 {
    if (!S3_ACCESS_KEY) {
      throw new BadRequestException('S3_ACCESS_KEY is undefined');
    }

    if (!S3_SECRET_KEY) {
      throw new BadRequestException('S3_SECRET_KEY is undefined');
    }

    return new S3({
      forcePathStyle: true,
      endpoint: S3_ENDPOINT,
      region: S3_REGION,
      credentials: {
        accessKeyId: S3_ACCESS_KEY,
        secretAccessKey: S3_SECRET_KEY,
      },
    });
  }
}
