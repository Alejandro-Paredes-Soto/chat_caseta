import { readTextFile, writeFile, BaseDirectory } from '@tauri-apps/api/fs'

export const readAndWriteFileConf = async (servidor?: string, token?: string ) : Promise<void> => {
     
    const result: string = await readTextFile('conf.json', { dir: BaseDirectory.Resource })

    const json = JSON.parse(result)

    json['servidor'] = servidor ? servidor : '',
    json['token'] = token ? token : ''

    await writeFile('conf.json', JSON.stringify(json), { dir: BaseDirectory.Resource })

    
}