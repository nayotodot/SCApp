import {
	// Menu,
	MenuItem,
	BrowserWindow,
	KeyboardEvent,
	MenuItemConstructorOptions
} from "electron";
import {
	MENU_ABOUT,
	MENU_PREFERENCES,
	MENU_HIDE,
	MENU_HIDEOTHERS,
	MENU_QUIT,
	MENU_SCREENSHOT,
	MENU_RELOAD,
	MENU_FORCERELOAD,
	// MENU_ACTUALSIZE,
	// MENU_ZOOMIN,
	// MENU_ZOOMOUT,
	MENU_TOGGLEFULLSCREEN,
	MENU_VIEWMENU,
	MENU_GOBACK,
	MENU_GOFORWARD,
	MENU_GOHOME,
	MENU_GOGASHA,
	MENU_GOIDOLPORTAL,
	MENU_GOMISSION,
	MENU_GOBUSINESS,
	MENU_GOPRODUCE,
	MENU_GOFES,
	MENU_GOMENU,
	MENU_MINIMIZE,
	MENU_WINDOWMENU,
} from "./lang/ja.json";
import { isMac, isDevMode } from "./utils";

const SEPARATOR: MenuItemConstructorOptions = { "type": "separator" };

export const template: Array<MenuItemConstructorOptions> = [];

if( isMac )
{
	template.push(
		{
			"role": "appMenu",
			"submenu": [
				{ "label": MENU_ABOUT, "role": "about" },
				SEPARATOR,
				{ "label": MENU_PREFERENCES, "accelerator": "Cmd+," },
				SEPARATOR,
				{ "label": MENU_HIDE, "role": "hide" },
				{ "label": MENU_HIDEOTHERS, "role": "hideOthers" },
				SEPARATOR,
				{ "label": MENU_QUIT, "role": "quit" },
			]
		}
	);
}

if( isDevMode )
{
	template.push(
		{
			"role": "editMenu",
			"submenu": [
				{ "role": "undo" },
				{ "role": "redo" },
				SEPARATOR,
				{ "role": "cut" },
				{ "role": "copy" },
				{ "role": "paste" },
				{ "role": "delete" },
				{ "role": "selectAll" },
			]
		}
	);
}

function captureCanvas( menuItem: MenuItem, browserWindow: BrowserWindow | any, event: KeyboardEvent ): void
{
	browserWindow.webContents?.send( "capture-canvas" );
}
template.push(
	{
		"label": MENU_VIEWMENU,
		"role": "viewMenu",
		"submenu": [
			{ "label": MENU_SCREENSHOT, "accelerator": "CmdOrCtrl+S", "click": captureCanvas },
			SEPARATOR,
			{ "label": MENU_RELOAD, "role": "reload" },
			{ "label": MENU_FORCERELOAD, "role": "forceReload" },
			SEPARATOR,
			{ "label": MENU_TOGGLEFULLSCREEN, "role": "togglefullscreen" },
		]
	}
);

// let goBackMenuItem: MenuItem;
// let goForwardMenuItem: MenuItem;
// let canGoBack: boolean = false;
// let canGoForward: boolean = false;
/* 
export function updateBackAndForward( browserWindow: BrowserWindow | any ): void
{
	if( goBackMenuItem )
	{
		goBackMenuItem.enabled = browserWindow.webContents?.canGoBack();
	}
	if( goForwardMenuItem )
	{
		goForwardMenuItem.enabled = browserWindow.webContents?.canGoForward();
	}
} 
*/
function loadURL( browserWindow: BrowserWindow | any, pathname: string ): void
{
	const contents = browserWindow.webContents;
	if( contents ) {
		const currentURL = new URL( contents.getURL() );
		currentURL.pathname = pathname;
		contents.loadURL( currentURL.toString() );
	}
	// updateBackAndForward( browserWindow );
}
function goBack( menuItem: MenuItem, browserWindow: BrowserWindow | any, event: KeyboardEvent ): void
{
	// if( !goBackMenuItem )
	// {
	// 	goBackMenuItem = menuItem;
	// }
	if( browserWindow.webContents?.canGoBack() )
	{
		browserWindow.webContents?.goBack();
	}
	// updateBackAndForward( browserWindow );
	// menuItem.enabled = canGoBack;
}
function goForward( menuItem: MenuItem, browserWindow: BrowserWindow | any, event: KeyboardEvent ): void
{
	// if( !goForwardMenuItem )
	// {
	// 	goForwardMenuItem = menuItem;
	// }
	if( browserWindow.webContents?.canGoForward() )
	{
		browserWindow.webContents?.goForward();
	}
	// updateBackAndForward( browserWindow );
	// menuItem.enabled = canGoForward;
}
function goHome( menuItem: MenuItem, browserWindow: BrowserWindow | any, event: KeyboardEvent ): void
{
	loadURL( browserWindow, "home" );
}
function goGasha( menuItem: MenuItem, browserWindow: BrowserWindow | any, event: KeyboardEvent ): void
{
	loadURL( browserWindow, "gasha" );
}
function goIdolPortal( menuItem: MenuItem, browserWindow: BrowserWindow | any, event: KeyboardEvent ): void
{
	loadURL( browserWindow, "idolPortal" );
}
function goMission( menuItem: MenuItem, browserWindow: BrowserWindow | any, event: KeyboardEvent ): void
{
	loadURL( browserWindow, "mission" );
}
function goBusiness( menuItem: MenuItem, browserWindow: BrowserWindow | any, event: KeyboardEvent ): void
{
	loadURL( browserWindow, "workActivity" );
}
function goProduce( menuItem: MenuItem, browserWindow: BrowserWindow | any, event: KeyboardEvent ): void
{
	loadURL( browserWindow, "produce" );
}
function goFes( menuItem: MenuItem, browserWindow: BrowserWindow | any, event: KeyboardEvent ): void
{
	loadURL( browserWindow, "fesTop" );
}

template.push(
	{
		"label": MENU_GOMENU,
		"submenu": [
			{ "label": MENU_GOBACK,       "accelerator": "CmdOrCtrl+[",       "click": goBack,    /* "enabled": canGoBack */ },
			{ "label": MENU_GOFORWARD,    "accelerator": "CmdOrCtrl+]",       "click": goForward, /* "enabled": canGoForward */ },
			SEPARATOR,
			{ "label": MENU_GOHOME,       "accelerator": "CmdOrCtrl+Shift+h", "click": goHome },
			{ "label": MENU_GOGASHA,      "accelerator": "CmdOrCtrl+Shift+g", "click": goGasha },
			{ "label": MENU_GOIDOLPORTAL, "accelerator": "CmdOrCtrl+Shift+i", "click": goIdolPortal },
			{ "label": MENU_GOMISSION,    "accelerator": "CmdOrCtrl+Shift+m", "click": goMission },
			{ "label": MENU_GOBUSINESS,   "accelerator": "CmdOrCtrl+Shift+b", "click": goBusiness },
			{ "label": MENU_GOPRODUCE,    "accelerator": "CmdOrCtrl+Shift+p", "click": goProduce },
			{ "label": MENU_GOFES,        "accelerator": "CmdOrCtrl+Shift+f", "click": goFes },
		]
	}
);

if( isDevMode )
{
	template.push(
		{
			"label": MENU_WINDOWMENU,
			"submenu": [
				{ "label": MENU_MINIMIZE, "role": "minimize" },
			]
		}
	);
}
