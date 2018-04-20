import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {
  newPet: any;
  errors: any;

  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this.newPet = { name: "", type: "", desc: "", skill1: null, skill2: null, skill3: null};
  }

  addNewPet() {
    let observable = this._httpService.addPet(this.newPet);
    observable.subscribe(data => {
      if (data['message'] == 'bad') {
        this.errors = "Please make sure your pet's type, name, and description are at least 3 characters long.";
      }
      else if (data['message'] == 'NOPE') {
        this.errors = "A pet with this name already exists; please choose another.";
      }
      else {
        this._router.navigate(['/home']);
      }
   });
  }
}
