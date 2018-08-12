import { CodeModel } from '@ngstack/code-editor/public_api';

export class FileNode {
  children?: FileNode[];
  filename: string;
  type?: any;

  code?: CodeModel;
}
