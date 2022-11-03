import {
	app,
	BrowserWindow,
	ipcMain,
	Menu,
	// MenuItemConstructorOptions,
	// net,
	// WebRequestFilter
} from "electron";
// import { Buffer } from "node:buffer";
// import * as fs from "node:fs";
import * as path from "node:path";

import { template/* , updateBackAndForward */ } from "./ApplicationMenu";
import { SCREEN_WIDTH, SCREEN_HEIGHT, END_POINT_URL, isMac, isDevMode } from "./utils";
import saveScreenshot from "./saveScreenshot";

app.commandLine.appendSwitch( "force_high_performance_gpu" );
app.commandLine.appendSwitch( "disable-site-isolation-trials" );

app.once( "ready", () => {
	const appURL: URL = new URL( END_POINT_URL );

	const mainWin: BrowserWindow | null = new BrowserWindow({
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		useContentSize: true,
		center: true,
		minWidth: SCREEN_WIDTH * 0.5,
		minHeight: SCREEN_HEIGHT * 0.5,
		maxWidth: SCREEN_WIDTH * 4.0,
		maxHeight: SCREEN_HEIGHT * 4.0,
		show: false,
		backgroundColor: "#000000",
		visualEffectState: "active",
		webPreferences: {
			preload: path.join( __dirname, "renderer.js" ),
			backgroundThrottling: false,
		},
	});
	mainWin.loadURL( appURL.toString() );

	const splashWin: BrowserWindow | null = new BrowserWindow({
		width: 582,
		height: 360,
		resizable: false,
		movable: false,
		closable: false,
		alwaysOnTop: true,
		frame: false,
		modal: true,
		hasShadow: false,
		transparent: true,
	});
	splashWin.loadFile( path.join( __dirname, "../src", "splash", "index.html" ) );

	mainWin.on( "page-title-updated", event => {
		event.preventDefault();
	});

	mainWin.once( "ready-to-show", () => {
		splashWin.destroy();
		mainWin.show();
	});

	const contents = mainWin.webContents;
	{
		if( isDevMode ) {
			contents.openDevTools({ mode: "detach" });
			contents.inspectServiceWorker();
		}

		function send(): void
		{
			contents.send( "keep-audio" );
			contents.send( "load-notifications" );
		}
		contents.on( "did-finish-load", send );
		contents.on( "did-start-loading", send );
		contents.on( "did-stop-loading", send );
		// contents.on( "did-start-loading", () => updateBackAndForward(mainWin) );
		// contents.on( "did-stop-loading", () => updateBackAndForward(mainWin) );
	}

	const session = contents.session;
	{
		// session.clearCache();

		session.setPermissionRequestHandler( (webContents,permission,callback) => {
			console.log( `webContents.getURL(): ${webContents.getURL()}` );
			console.log( `setPermissionRequestHandler: ${permission}` );
			if( new URL(webContents.getURL()).hostname === appURL.hostname && (permission === "media" || permission === "notifications") ) {
				callback( true );
				return;
			}
			callback( false );
		});

		session.setPermissionCheckHandler( (webContents,permission,requestingOrigin,details) => {
			const origURL = new URL(requestingOrigin);
			console.log( `requestingOrigin: ${requestingOrigin}` );
			console.log( `setPermissionCheckHandler: ${permission}` );
			if( permission === "background-sync" ) {
				return true;
			}
			if( permission === "accessibility-events" ) {
				return true;
			}
			else if( (permission === "media" || permission === "notifications") && origURL.hostname === appURL.hostname ) {
				return true;
			}
			return false;
		});

		const webRequest = session.webRequest;
		{
			webRequest.onBeforeRequest( (details,callback) => {
				const response = {
					cancel: false,
				};
				switch( details.method ) {
					case "GET": {
						const thisURL = new URL( details.url );
						const protocol: string = thisURL.protocol;
						const hostname: string = thisURL.hostname;
						response.cancel = (
							protocol === "https:" &&
							!hostname.includes("apple.com") &&
							!hostname.includes("bandainamcoent.co.jp") &&
							!hostname.includes("bandainamcoid.com") &&
							!hostname.includes("channel.or.jp") &&
							!hostname.includes("enza.fun") &&
							!hostname.includes("ravenjs.com") &&
							!hostname.includes("stripe")
							// sentry.io
							// twitter.com/intent/
						);
					}
					break;
				}

				if( response.cancel ) {
					console.log( `Blocked: ${details.url}` );
				}

				callback( response );
			});
			/*
			const filter: WebRequestFilter = {
				urls: [ "https://shinycolors.enza.fun/assets/*" ],
			};
			webRequest.onBeforeSendHeaders( filter, (details,callback) => {
				const requestURL = new URL( details.url );
				const filePath = path.join( USERDATA_DIR, path.basename(requestURL.pathname) );

				if( !fs.existsSync(filePath) ) {
					const file = fs.createWriteStream( filePath );
					const options = {
						method: details.method,
						protocol: requestURL.protocol,
						hostname: requestURL.hostname,
						path: requestURL.pathname,
						session: details.webContents?.session,
						useSessionCookies: true,
					};
					const request = net.request( options );
					request.on( "response", response => {
						response.on( "data", (chunk) => file.write(chunk) );
						response.on( "end", () => file.end() );
					});
					request.end();
				} else {
					details.url = path.join( "file://", filePath );
				}

				callback({ requestHeaders: details.requestHeaders });
			});
			*/
		}
	}
});

app.on( "window-all-closed", () => {
	if( !isMac ) {
		app.quit();
	}
});

{
	const menu: Menu = Menu.buildFromTemplate( template );
	Menu.setApplicationMenu( menu );
}

/*
 * Event Handlers
 */
ipcMain.on( "save-screenshot", saveScreenshot );
