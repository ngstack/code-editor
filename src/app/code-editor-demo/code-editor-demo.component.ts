import {
  Component,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  OnInit
} from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { FileNode } from './file-node';
import { FileDatabase } from './file-database';

@Component({
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

  @ViewChild('file')
  fileInput: ElementRef;

  options = {
    contextmenu: true,
    minimap: {
      enabled: false
    }
  };

  constructor(database: FileDatabase) {
    this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();

    database.dataChange.subscribe(data => (this.nestedDataSource.data = data));
  }

  hasNestedChild = (_: number, nodeData: FileNode) => !nodeData.type;

  private _getChildren = (node: FileNode) => node.children;

  onCodeChanged(value) {
    // console.log('CODE', value);
  }

  selectNode(node: FileNode) {
    console.log(node);
    this.selectedModel = node.code;
  }

  ngOnInit() {}
}
