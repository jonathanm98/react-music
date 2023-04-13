import {Controller, Get, Res, Param} from '@nestjs/common';
import {MusicService} from './music.service';
import {Response} from 'express';

@Controller('music')
export class MusicController {
    constructor(private readonly todoService: MusicService) {
    }

    @Get()
    async allFiles(@Res() res: Response): Promise<any[]> {
        res.setHeader('Content-Type', 'application/json');
        res.json(await this.todoService.allFiles());
        return;
    }

    @Get("/infos/:id")
    async findFileInfos(@Param('id') id: number, @Res() res: Response): Promise<void> {
        res.setHeader('Content-Type', 'application/json');
        const {tags} = await this.todoService.findFileInfos(id);
        res.json({tags});
    }
    @Get("/stream/:id")
    async findFileStream(@Param('id') id: number, @Res() res: Response): Promise<void> {
        res.setHeader('Content-Type', 'audio/mpeg');
        const {file} = await this.todoService.findFileStream(id);
        file.pipe(res);
    }
}
