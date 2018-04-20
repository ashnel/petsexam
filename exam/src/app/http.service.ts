import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class HttpService {

  constructor(private _http: HttpClient) { }

  addPet (pet) {
    return this._http.post('/add', pet);
  }

  getAllPets () {
    return this._http.get('/pets');
  }

  getPetById(pet_id) {
    return this._http.get('/details/' + pet_id);
  }

  adoptAndDeletePet(pet) {
    return this._http.delete('/delete/' + pet._id);
  }

  likePetByID(pet_id) {
    return this._http.put('/upvote/' + pet_id);
  }

  updatePetById (pet_id, pet) {
    return this._http.put('/update/' + pet_id, pet);
  }
}
