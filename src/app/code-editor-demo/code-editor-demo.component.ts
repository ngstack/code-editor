import {
  Component,
  HostBinding,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  CodeEditorComponent,
  CodeEditorModule,
  CodeEditorService,
  CodeModel,
  CodeModelChangedEvent
} from '@ngstack/code-editor';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FileDatabase } from './file-database';
import { FileNode } from './file-node';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { editor } from 'monaco-editor';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select';

@Component({
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatProgressBarModule,
    CodeEditorModule,
    MatFormField,
    MatSelect,
    MatOption,
    MatLabel,
  ],
  selector: 'app-code-editor-demo',
  templateUrl: './code-editor-demo.component.html',
  styleUrls: ['./code-editor-demo.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [FileDatabase]
})
export class CodeEditorDemoComponent implements OnInit {
  themes = [
    { name: 'Visual Studio', value: 'vs' },
    { name: 'Visual Studio Dark', value: 'vs-dark' },
    { name: 'High Contrast Dark', value: 'hc-black' }
  ];

  selectedModel: CodeModel = null;
  activeTheme = 'vs';
  readOnly = false;
  isLoading = false;
  isLoading$: Observable<boolean>;

  private _codeEditor: CodeEditorComponent;

  @ViewChild(CodeEditorComponent, { static: false })
  set codeEditor(value: CodeEditorComponent) {
    this._codeEditor = value;
  }

  get codeEditor(): CodeEditorComponent {
    return this._codeEditor;
  }

  @HostBinding('class')
  class = 'app-code-editor-demo';

  options: editor.IStandaloneEditorConstructionOptions = {
    contextmenu: true,
    minimap: {
      enabled: false
    }
  };

  files: FileNode[];
  selectedFile: FileNode;

  constructor(database: FileDatabase, editorService: CodeEditorService) {
    database.dataChange.subscribe(
      (data) => {
        this.files = data;
        this.selectedFile = this.files[0];
        this.selectNode(this.selectedFile);
      }
    );

    this.isLoading$ = editorService.loadingTypings.pipe(debounceTime(300));
  }

  onCodeChanged(value) {
    // console.log('CODE', value);
  }

  selectNode(node: FileNode) {
    this.isLoading = false;
    console.log(node);
    this.selectedModel = node.code;
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
    /*
    this.selectedModel = {
      language: 'json',
      uri: 'main.json',
      value: '{}'
    };
    */
  }

  onEditorLoaded(editor: CodeEditorComponent) {
    console.log('loaded', editor);
  }

  onCodeModelChanged(event: CodeModelChangedEvent) {
    console.log('code model changed', event);

    setTimeout(() => {
      event.sender.formatDocument();
    }, 100);
  }

  onSelectionChange($event: MatSelectChange) {
    const fileNode = $event.value as FileNode;
    this.selectNode(fileNode);
  }
}
