import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  currentPet: any;

  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this.getCurrentPet();
  }

  getCurrentPet() {
    let observable = this._httpService.getPetById(this._route.params['value'].id);
    observable.subscribe(data => {
      this.currentPet = data['data'][0];
   });
  }

  adopt(pet) {
    let observable = this._httpService.adoptAndDeletePet(pet);
    observable.subscribe(data => {
   });
   this._router.navigate(['/home']);
  }

  likePet(pet) {
    let observable = this._httpService.likePetByID(pet._id);
    let observable2 = this._httpService.getPetById(this._route.params['value'].id);
    observable.subscribe(data => {
      
   });
    observable2.subscribe(data => {
      this.currentPet = data['data'][0];
   });
  }
}
