import { app, IpcMainEvent } from "electron";
import { resolve } from "node:path";
import { existsSync, mkdirSync, writeFile } from "node:fs";

const PREFIX_NAME: string = "imassc_screenshot_";
const PICTURES_DIR: string = resolve( app.getPath("pictures"), app.getName() );

if( !existsSync(PICTURES_DIR) )
{
	mkdirSync( PICTURES_DIR );
}

export default function( event: IpcMainEvent, data: string ): void
{
	const file: string = resolve( PICTURES_DIR, "imassc_screenshot_" + Date.now() + ".png" );
	writeFile( file, data, "base64", (err): void => {if(err) throw err;} );
}
