import { CodeModel } from '@ngstack/code-editor';

export enum FileNodeType {
  file = 'file',
  folder = 'folder',
}

export class FileNode {
  children?: FileNode[];
  name: string;
  type: FileNodeType;

  code?: CodeModel;
}
