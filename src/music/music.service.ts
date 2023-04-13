import {Injectable} from '@nestjs/common';
import {createReadStream} from 'fs';
import {readdir} from 'fs/promises';
import {resolve} from 'path';

@Injectable()
export class MusicService {
    async readMediaTags(path: string): Promise<any> {
        const jsmediatags = await import('jsmediatags');
        return new Promise((resolve, reject) => {
            jsmediatags.read(path, {
                onSuccess: (tags) => resolve(tags),
                onError: (error) => reject(error),
            });
        });
    }

    async allFiles(): Promise<any[]> {
        try {
            const files = await readdir("./src/songs");
            const promises = files.map(async (file, index) => {
                const filePath = resolve(`./src/songs/${file}`);
                const tags: any[] = await this.readMediaTags(filePath);
                return {index, name: file, file: tags};
            });
            return await Promise.all(promises);
        } catch (error) {
            console.log(error);
            return [{err: error}];
        }
    }

    async findFileInfos(id: number): Promise<{tags: any[] }> {
        try {
            const files = await readdir("./src/songs");
            const filePath: string = resolve(`./src/songs/${files[id]}`);
            const tags: any[] = await this.readMediaTags(filePath);
            return {tags};
        } catch (error) {
            console.log(error);
        }
    }
    async findFileStream(id: number): Promise<{ file: NodeJS.ReadableStream}> {
        try {
            const files = await readdir("./src/songs");
            const filePath: string = resolve(`./src/songs/${files[id]}`);
            const file: NodeJS.ReadableStream = createReadStream(filePath);
            return {file};
        } catch (error) {
            console.log(error);
        }
    }

}
