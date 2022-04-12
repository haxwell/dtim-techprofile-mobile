import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

import { environment } from '../../_environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _apiService: ApiService) {

  }

  createNewUser(name, phone, email, password) {
  	const url = environment.apiUrl + '/api/user/new';
  	let data = 'name=' + name;

  	if (phone) {
  		data += '&phone=' + phone;
  	}

  	if (email) {
  		data += '&email=' + email;
  	}

  	if (password) {
  		data += '&password=' + password;
  	}

	const rtn = new Promise(
		(resolve, reject) => {
			this._apiService.postUnsecuredAPI(url, data).subscribe(
				(_data) => {
					console.log('New Account Saved!');
					console.log(_data);

					resolve(_data);
				}, (err) => {
					reject(err);
				});
		});

	return rtn;
  }

  markUserAsAttending(userId) {
  	const url = environment.apiUrl + '/api/user/' + userId + '/markInAttendance';

  	const data = 'userId=' + userId;

	const rtn = new Promise(
		(resolve, reject) => {
			this._apiService.postUnsecuredAPI(url, data).subscribe(
				(_data) => {
					console.log('User ' + userId + ' marked in attendance!');
					console.log(_data);

					resolve(_data);
				}, (err) => {
					reject(err);
				});
		});

	return rtn;
  }

  getUserByEmailOrPhone(query) {
  	const url = environment.apiUrl + '/api/user?q=' + query;

	const rtn = new Promise(
		(resolve, reject) => {
			this._apiService.getUnsecuredAPI(url).subscribe(
				(_data) => {
					console.log('User query call returned');
					console.log(_data);

					resolve(_data);
				}, (err) => {
					reject(err);
				});
		});

	return rtn;
  }

  getUserById(id) {
  	const url = environment.apiUrl + '/api/user/' + id;

	const rtn = new Promise(
		(resolve, reject) => {
			this._apiService.getUnsecuredAPI(url).subscribe(
				(_data) => {
					console.log('User by id call returned');
					console.log(_data);

					resolve(_data);
				}, (err) => {
					reject(err);
				});
		});

	return rtn;

  }

}
