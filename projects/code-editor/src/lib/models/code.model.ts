export interface CodeModel {
  language: string;
  value: string;
  uri: string;

  dependencies?: Array<string>;
  schemas?: Array<string>;
}
