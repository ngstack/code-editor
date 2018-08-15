import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  OnChanges,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CodeEditorService } from '../services/code-editor.service';
import { TypescriptDefaultsService } from '../services/typescript-defaults.service';
import { JavascriptDefaultsService } from '../services/javascript-defaults.service';
import { JsonDefaultsService } from '../services/json-defaults.service';
import { CodeModel } from '../models/code.model';

declare const monaco: any;

@Component({
  selector: 'ngs-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line:use-host-property-decorator
  host: { class: 'ngs-code-editor' }
})
export class CodeEditorComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  private _editor: any;
  private _model: any;
  // private _value = '';

  private defaultOptions = {
    lineNumbers: true,
    contextmenu: false,
    minimap: {
      enabled: false
    }
  };

  private subscriptions: Subscription[] = [];

  @ViewChild('editor')
  editorContent: ElementRef;

  @Input()
  codeModel: CodeModel;

  // @Input()
  // set value(v: string) {
  //   if (v !== this._value) {
  //     this._value = v;
  //     this.setEditorValue(v);
  //     this.valueChanged.emit(v);
  //   }
  // }

  // get value(): string {
  //   return this._value;
  // }

  /**
   * Editor theme. Defaults to `vs`.
   *
   * Allowed values: `vs`, `vs-dark` or `hc-black`.
   * @memberof CodeEditorComponent
   */
  @Input()
  theme = 'vs';

  /**
   * Editor options.
   *
   * See https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html for more details.
   *
   * @memberof CodeEditorComponent
   */
  @Input()
  options = {};

  /**
   * Toggle readonly state of the editor.
   *
   * @memberof CodeEditorComponent
   */
  @Input()
  readOnly = false;

  @Output()
  valueChanged = new EventEmitter<string>();

  @Output()
  loaded = new EventEmitter();

  constructor(
    private editorService: CodeEditorService,
    private typescriptDefaults: TypescriptDefaultsService,
    private javascriptDefaults: JavascriptDefaultsService,
    private jsonDefaults: JsonDefaultsService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];

    if (this._editor) {
      this._editor.dispose();
      this._editor = null;
    }

    if (this._model) {
      this._model.dispose();
      this._model = null;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.codeModel && !changes.codeModel.firstChange) {
      this.updateModel(changes.codeModel.currentValue);
    }

    if (changes.readOnly && !changes.readOnly.firstChange) {
      if (this._editor) {
        this._editor.updateOptions({
          readOnly: changes.readOnly.currentValue
        });
      }
    }

    if (changes.theme && !changes.theme.firstChange) {
      monaco.editor.setTheme(changes.theme.currentValue);
    }
  }

  async ngAfterViewInit() {
    await this.editorService.loadEditor();
    this.setupEditor();
    this.loaded.emit();
  }

  private setupEditor() {
    const domElement: HTMLDivElement = this.editorContent.nativeElement;
    const { value, language, uri } = this.codeModel;

    this._model = monaco.editor.createModel(
      value,
      language,
      monaco.Uri.file(uri || 'code')
    );

    const options = Object.assign({}, this.defaultOptions, this.options, {
      readOnly: this.readOnly,
      theme: this.theme,
      model: this._model
    });

    this._editor = monaco.editor.create(domElement, options);

    this._model.onDidChangeContent(e => {
      const newValue = this._model.getValue();
      if (this.codeModel) {
        this.codeModel.value = newValue;
      }
      this.valueChanged.emit(newValue);
    });

    this.setupDependencies(this.codeModel);
  }

  private setupDependencies(model: CodeModel) {
    const { language } = model;

    if (language) {
      const lang = language.toLowerCase();

      switch (lang) {
        case 'typescript':
          if (model.dependencies) {
            this.editorService.loadTypings(model.dependencies);
          }
          break;
        case 'javascript':
          if (model.dependencies) {
            this.editorService.loadTypings(model.dependencies);
          }
          break;
        case 'json':
          if (model.schemas) {
            this.jsonDefaults.addSchemas(model.uri, model.schemas);
          }
          break;
        default:
          break;
      }
    }
  }

  private setEditorValue(value: any): void {
    // Fix for value change while dispose in process.
    setTimeout(() => {
      if (this._model) {
        this._model.setValue(value);
      }
    });
  }

  private updateModel(model: CodeModel) {
    this.setEditorValue(model.value);
    if (this._model && typeof monaco !== undefined) {
      monaco.editor.setModelLanguage(this._model, model.language);
    }
    this.setupDependencies(this.codeModel);
  }
}
