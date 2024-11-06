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
  HostListener,
  inject
} from '@angular/core';
import { CodeEditorService } from '../services/code-editor.service';
import { TypescriptDefaultsService } from '../services/typescript-defaults.service';
import { JavascriptDefaultsService } from '../services/javascript-defaults.service';
import { JsonDefaultsService } from '../services/json-defaults.service';
import { CodeModel } from '../models/code.model';
import { editor } from 'monaco-editor';

export interface CodeModelChangedEvent {
  sender: CodeEditorComponent;
  value: CodeModel;
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ngs-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  // eslint-disable-next-line
  host: { class: 'ngs-code-editor' }
})
export class CodeEditorComponent
  implements OnChanges, OnDestroy, AfterViewInit
{
  private _editor: editor.ICodeEditor;
  private _model: editor.ITextModel;
  // private _value = '';

  private defaultOptions: editor.IStandaloneEditorConstructionOptions = {
    lineNumbers: 'on',
    contextmenu: false,
    minimap: {
      enabled: false
    }
  };

  /**
   * The instance of the editor.
   */
  get editor(): editor.ICodeEditor {
    return this._editor;
  }

  protected set editor(value: editor.ICodeEditor) {
    this._editor = value;
  }

  @ViewChild('editor', { static: true })
  editorContent: ElementRef<HTMLDivElement>;

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
   * See https://microsoft.github.io/monaco-editor/docs.html#interfaces/editor.IStandaloneEditorConstructionOptions.html for more details.
   *
   * @memberof CodeEditorComponent
   */
  @Input()
  options: editor.IStandaloneEditorConstructionOptions = {};

  /**
   * Toggle readonly state of the editor.
   *
   * @memberof CodeEditorComponent
   */
  @Input()
  readOnly = false;

  /**
   * An event emitted when the text content of the model have changed.
   */
  @Output()
  valueChanged = new EventEmitter<string>();

  /**
   * An event emitted when the code model value is changed.
   */
  @Output()
  codeModelChanged = new EventEmitter<CodeModelChangedEvent>();

  /**
   * An event emitted when the contents of the underlying editor model have changed.
   */
  @Output()
  modelContentChanged = new EventEmitter<editor.IModelContentChangedEvent>();

  /**
   * Raised when editor finished loading all its components.
   */
  @Output()
  loaded = new EventEmitter<CodeEditorComponent>();

  protected editorService = inject(CodeEditorService);
  protected typescriptDefaults = inject(TypescriptDefaultsService);
  protected javascriptDefaults = inject(JavascriptDefaultsService);
  protected jsonDefaults = inject(JsonDefaultsService);

  ngOnDestroy() {
    if (this.editor) {
      this.editor.dispose();
      this.editor = null;
    }

    if (this._model) {
      this._model.dispose();
      this._model = null;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const codeModel = changes['codeModel'];
    const readOnly = changes['readOnly'];
    const theme = changes['theme'];

    if (codeModel && !codeModel.firstChange) {
      this.updateModel(codeModel.currentValue);
    }

    if (readOnly && !readOnly.firstChange) {
      if (this.editor) {
        this.editor.updateOptions({
          readOnly: readOnly.currentValue
        });
      }
    }

    if (theme && !theme.firstChange) {
      this.editorService.setTheme(theme.currentValue);
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (this.editor) {
      this.editor.layout();
    }
  }

  async ngAfterViewInit() {
    this.setupEditor();
    this.loaded.emit(this);
  }

  private setupEditor() {
    const domElement = this.editorContent.nativeElement;
    const settings = {
      value: '',
      language: 'text',
      uri: `code-${Date.now()}`,
      ...this.codeModel
    };

    this._model = this.editorService.createModel(
      settings.value,
      settings.language,
      settings.uri
    );

    const options = Object.assign({}, this.defaultOptions, this.options, {
      readOnly: this.readOnly,
      theme: this.theme,
      model: this._model
    });

    this.editor = this.editorService.createEditor(domElement, options);

    this._model.onDidChangeContent((e: editor.IModelContentChangedEvent) => {
      this.modelContentChanged.emit(e);

      const newValue = this._model.getValue();
      if (this.codeModel) {
        this.codeModel.value = newValue;
      }
      this.valueChanged.emit(newValue);
    });

    this.setupDependencies(this.codeModel);
    this.codeModelChanged.emit({ sender: this, value: this.codeModel });
  }

  runEditorAction(id: string, args?: unknown) {
    this.editor.getAction(id)?.run(args);
  }

  formatDocument() {
    this.runEditorAction('editor.action.formatDocument');
  }

  private setupDependencies(model: CodeModel) {
    if (!model) {
      return;
    }

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
    if (model) {
      this.setEditorValue(model.value);
      this.editorService.setModelLanguage(this._model, model.language);
      this.setupDependencies(model);
      this.codeModelChanged.emit({ sender: this, value: model });
    }
  }
}
