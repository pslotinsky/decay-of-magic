import sharp from 'sharp';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { File } from '@/lore/file.entity';
import { FileTransform } from '@/lore/file-transform';

const FORMAT_MIMETYPE: Record<NonNullable<FileTransform['format']>, string> = {
  webp: 'image/webp',
};

export class TransformFileCommand extends Command<File> {
  constructor(
    public file: File,
    public transform: FileTransform,
  ) {
    super();
  }
}

@CommandHandler(TransformFileCommand)
export class TransformFileUseCase implements ICommandHandler<
  TransformFileCommand,
  File
> {
  public async execute({
    file,
    transform,
  }: TransformFileCommand): Promise<File> {
    let pipeline = sharp(file.buffer, { failOn: 'error' });

    if (transform.crop) {
      pipeline = pipeline.extract({
        left: transform.crop.x,
        top: transform.crop.y,
        width: transform.crop.width,
        height: transform.crop.height,
      });
    }

    if (transform.resize) {
      pipeline = pipeline.resize({
        width: transform.resize.width,
        height: transform.resize.height,
        fit: 'cover',
      });
    }

    let mimetype = file.mimetype;
    let name = file.name;

    if (transform.format === 'webp') {
      pipeline = pipeline.webp({ quality: transform.quality ?? 80 });
      mimetype = FORMAT_MIMETYPE.webp;
      name = this.swapExtension(file.name, 'webp');
    }

    const buffer = await pipeline.toBuffer();

    return File.create({
      id: file.id,
      category: file.category,
      buffer,
      mimetype,
      name,
    });
  }

  private swapExtension(name: string, extension: string): string {
    const dot = name.lastIndexOf('.');
    const base = dot === -1 ? name : name.slice(0, dot);
    return `${base}.${extension}`;
  }
}
