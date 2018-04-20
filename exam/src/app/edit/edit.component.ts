import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  currentPet: any;
  errors: any;

  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this.errors;
    this.getCurrentPet();
  }

  getCurrentPet() {
    let observable = this._httpService.getPetById(this._route.params['value'].id);
    observable.subscribe(data => {
      this.currentPet = data['data'][0];
   });
  }

  updatePet () {
    let observable = this._httpService.updatePetById(this._route.params['value'].id, this.currentPet);
    observable.subscribe(data => {
      if (data['message'] == 'good') {
        this._router.navigate(['/home']);
      }
      else {
        this.errors = "Please make sure your pet's type, name, and description are at least 3 characters long.";
      }
   });
  }
}
