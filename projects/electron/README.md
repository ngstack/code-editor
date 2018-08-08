# @ngstack/electron

Angular library that provides integration with Electron.

## Installing

```sh
npm install @ngstack/electron
```

Then import the `ElectronModule` into your application

```ts
import { ElectronModule } from '@ngstack/electron';

@NgModule({
  imports: [
    ...,
    ElectronModule
  ],
  declarations: [...],
  providers: [...],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

## Features

### Electron Service

* detects when application is running with Electron
* provides access to `IpcRenderer` and cross-process communication
* runs channel listeners within `NgZone`
* does not affect the traditional Web applications

#### Properties

| Name         | Type    | Description                                                 |
| ------------ | ------- | ----------------------------------------------------------- |
| isDesktopApp | boolean | Detect whether service is running in a packaged desktop app |
| isWebApp     | boolean | Detect whether service is running in a traditional browser  |

#### Listening to messages

Inject the `ElectronService` instance into your component and use `ElectronService.on` method:

```ts
@Component({...})
export class AppComponent implements OnInit {

  constructor(private router: Router,
              private electron: ElectronService) {
  }

  ngOnInit() {
    this.electron.on('app:navigateRoute', (event: any, ...args: string[]) => {
      this.router.navigate([...args]);
    });
  }

}
```

Example above setups an `app:navigateRoute` channel listener,
and uses `Router` to navigate to the requested route automatically.

Now, in the Electron application shell you can request navigation like in the following example:

```js
BrowserWindow.getFocusedWindow().webContents.send(
  'app:navigateRoute',
  '/about'
);
```

Note that the `ElectronService.on` method has no effect in the traditional Web apps,
but you can still use it to have source code compatibility with the packaged scenarios.

#### Sending messages

Inject the `ElectronService` instance into your component and use `ElectronService.send` method:

```ts
@Component({...})
export class AppComponent {

  constructor(private electron: ElectronService) {}

  onButtonClicked(event: any, parameter: string) {
    this.electron.send('app:doSomething', parameter);
  }

}
```

Now, in the Electron application shell you can request navigation like in the following example:

```js
ipcMain.on('app:doSomething', (event, parameter) => {
  // your custom code with optional access to parameter passed from the web app
});
```

Note that the `ElectronService.send` method has no effect in the traditional Web apps,
but you can still use it to have source code compatibility with the packaged scenarios.
