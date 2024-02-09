import { NestedTreeControl } from '@angular/cdk/tree';
import {
  Component,
  HostBinding,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
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
import { FileNode, FileNodeType } from './file-node';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { editor } from 'monaco-editor';

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
    MatTreeModule,
    CodeEditorModule
  ],
  selector: 'app-code-editor-demo',
  templateUrl: './code-editor-demo.component.html',
  styleUrls: ['./code-editor-demo.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [FileDatabase]
})
export class CodeEditorDemoComponent implements OnInit {
  nestedTreeControl: NestedTreeControl<FileNode>;
  nestedDataSource: MatTreeNestedDataSource<FileNode>;

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

  constructor(database: FileDatabase, editorService: CodeEditorService) {
    this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();

    database.dataChange.subscribe(
      (data) => (this.nestedDataSource.data = data)
    );

    this.isLoading$ = editorService.loadingTypings.pipe(debounceTime(300));
  }

  hasNestedChild(_: number, nodeData: FileNode): boolean {
    return nodeData.type === FileNodeType.folder;
  }

  private _getChildren = (node: FileNode) => node.children;

  onCodeChanged(value) {
    // console.log('CODE', value);
  }

  isNodeSelected(node: FileNode): boolean {
    return (
      node &&
      node.code &&
      this.selectedModel &&
      node.code === this.selectedModel
    );
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
}
