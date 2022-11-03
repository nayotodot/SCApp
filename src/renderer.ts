import { ipcRenderer } from "electron";
import { isDevMode } from "./utils";
import Stats from "stats.js"

if( isDevMode ) {
	window.console = new Proxy( window.console, {
		get: (target: any, property: any) => {
			if( target[property] === "function" ) {
				return target[property].bind( target );
			} else {
				return target[property];
			}
		},
		set: () => {
			return true;
		},
	});
}

/*
 * Auto Reload
 */
window.addEventListener( "offline", () => {
	window.addEventListener( "online", () => {
		window.location.reload();
	});
});

/*
 * The MIT License
 * Copyright (c) 2009-2016 stats.js authors
 */
if( isDevMode ) {
	window.addEventListener( "load", () => {
		var stats = new Stats();
		stats.showPanel( 0 );
		document.body.appendChild( stats.dom );
		function animate() {
			stats.update();
			window.requestAnimationFrame( animate );
		}
		animate();
	});
}

/*
 * Save Screenshot
 */
const CANVAS_SELECTOR: string = "#prim-body canvas";

ipcRenderer.on( "capture-canvas", () => {
	const canvas: any = document.querySelector( CANVAS_SELECTOR );
	window.requestAnimationFrame( () => {
		const data: string = canvas.toDataURL().split( "base64," )[1];
		ipcRenderer.send( "save-screenshot", data );
	});
});

/*
 * Keep Audio
 */
ipcRenderer.on( "keep-audio", () => {
	document.addEventListener( "visibilitychange", (event: any) => event.stopImmediatePropagation() );
	window.addEventListener( "blur", (event: any) => event.stopImmediatePropagation(), false );
});

/*
 * Load Notifications
 */
// const INDEXED_DB_VERSION: number = 1;
// const INDEXED_DB_NAME: string = "shiny.colorsDB";
// const INDEXED_DB_STORE_NAME: string = "pushNotifications";

// ipcRenderer.on( "load-notifications", () => {
// 	window.addEventListener( "load", () => {
// 		const request = window.indexedDB.open( INDEXED_DB_NAME, INDEXED_DB_VERSION );
// 		request.onerror = (event: any) => console.error( event );
// 		request.onsuccess = (event: any) => {
// 			const db: any = event?.target?.result;
// 			const trans: any = db.transaction( INDEXED_DB_STORE_NAME, "readonly" );
// 			const store: any = trans.objectStore( INDEXED_DB_STORE_NAME );
// 			store.getAll().onsuccess = (event: any) => {
// 				event.target.result.forEach( (data: any) => {
// 					const options: object = { body: data.body, tag: data.tag };
// 					const time: number = data.time * 1000 - Date.now();
// 					if( time > 0 ) {
// 						setTimeout( () => { new Notification( data.title, options ); }, time );
// 					}
// 				});
// 			};
// 		};
// 	});
// });
