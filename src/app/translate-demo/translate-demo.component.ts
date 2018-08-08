import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngstack/translate';

@Component({
  selector: 'app-translate-demo',
  templateUrl: './translate-demo.component.html',
  styleUrls: ['./translate-demo.component.css']
})
export class TranslateDemoComponent implements OnInit {
  constructor(private translate: TranslateService) {}

  ngOnInit() {}

  changeLang(lang: string) {
    this.translate.activeLang = lang;
  }
}
