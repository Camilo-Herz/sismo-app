import { Component, OnInit } from '@angular/core';
import { BehaviorsService } from '../../services/behaviors/behaviors.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  active = false;

  constructor(
    private behaviorsService: BehaviorsService
  ) { }

  ngOnInit(): void {
    this.behaviorsService.getActiveLoader()
      .subscribe(
        response => {
          this.active = response;
        }
      );
  }

}
