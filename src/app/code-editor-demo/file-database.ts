import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FileNode } from './file-node';

const FILES_DATA: FileNode[] = [
  {
    filename: 'Applications',
    children: [
      {
        filename: 'Calendar',
        type: 'app'
      },
      {
        filename: 'Chrome',
        type: 'app'
      },
      {
        filename: 'Webstorm',
        type: 'app'
      }
    ]
  },
  {
    filename: 'Documents',
    children: [
      {
        filename: 'angular',
        children: [
          {
            filename: 'src',
            children: [
              {
                filename: 'compiler',
                type: 'ts'
              },
              {
                filename: 'core',
                type: 'ts'
              }
            ]
          }
        ]
      },
      {
        filename: 'material2',
        children: [
          {
            filename: 'src',
            children: [
              {
                filename: 'button',
                type: 'ts'
              },
              {
                filename: 'checkbox',
                type: 'ts'
              },
              {
                filename: 'input',
                type: 'ts'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    filename: 'Downloads',
    children: [
      {
        filename: 'October',
        type: 'pdf'
      },
      {
        filename: 'November',
        type: 'pdf'
      },
      {
        filename: 'Tutorial',
        type: 'html'
      }
    ]
  },
  {
    filename: 'Pictures',
    children: [
      {
        filename: 'Photo Booth Library',
        children: [
          {
            filename: 'Contents',
            type: 'dir'
          },
          {
            filename: 'Pictures',
            type: 'dir'
          }
        ]
      },
      {
        filename: 'Sun',
        type: 'png'
      },
      {
        filename: 'Woods',
        type: 'png'
      }
    ]
  }
];

@Injectable()
export class FileDatabase {
  dataChange = new BehaviorSubject<FileNode[]>([]);

  get data(): FileNode[] {
    return this.dataChange.value;
  }

  constructor() {
    this.initialize();
  }

  initialize() {
    const data = FILES_DATA;

    // Notify the change.
    this.dataChange.next(data);
  }
}
