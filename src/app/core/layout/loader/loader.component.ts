import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  active = false;

  constructor(
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.modalService.getActiveLoader()
      .subscribe(
        response => {
          console.log('****', response);
          this.active = response;
        }
      );
  }

}
