import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UserService } from './user.service';

import { environment } from '../../_environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TechProfileAPIService {

  constructor(private _apiService: ApiService,
              private _userService: UserService) {

  }

  get(techProfileId) {
    const url = environment.apiUrl + '/api/techprofile/' + techProfileId;

  	const rtn = new Promise(
  		(resolve, reject) => {
  			this._apiService.get(url).subscribe(
  				(data) => {
  					console.log('getTechProfile API call returned');
  					console.log(data);

  					resolve(data);
  				}, (err) => {
  					reject(err);
  				});
  		});

  	return rtn;
  }

  getScores(userId) {
    console.log('calling to get TechProfile scores for [' + userId + '] ');
  	const url = environment.apiUrl + '/api/user/' + userId + '/techprofile/scores';

  	const rtn = new Promise(
  		(resolve, reject) => {
  			this._apiService.get(url).subscribe(
  				(data) => {
  					console.log('get TechProfile scores for [' + userId + '] API call returned');
  					console.log(data);

  					resolve(data);
  				}, (err) => {
  					reject(err);
  				});
  		});

  	return rtn;
  }

  saveScores(userId, scores) {
  	const url = environment.apiUrl + '/api/user/' + userId + '/techprofile/scores';

  	const data = this.JSON_to_URLEncoded(scores);

  	const rtn = new Promise(
  		(resolve, reject) => {
  			this._apiService.post(url, data).subscribe(
  				(_data) => {
  					console.log('POST TechProfile scores for [' + userId + '] API call returned');
  					console.log(_data);

  					resolve(_data);
  				}, (err) => {
  					reject(err);
  				});
  		});

  	return rtn;
  }

  addTopic(name) {
  	const url = environment.apiUrl + '/api/techprofile/topics/new';

  	const data = 'topicName='+name;

  	const rtn = new Promise(
  		(resolve, reject) => {
  			this._apiService.post(url, data).subscribe(
  				(_data) => {
  					console.log('POST addTopic [' + name + '] API call returned');
  					console.log(_data);

  					resolve(_data);
  				}, (err) => {
  					reject(err);
  				});
  		});

  	return rtn;
  }

  addLineItem(topicId, name) {
  	return this.addLineItemWithDescriptions(topicId, name, 'level 0 desc', 'level 1 desc', 'level 2 desc', 'level 3 desc');
  }

  addLineItemWithDescriptions(topicId, name, l0description, l1description, l2description, l3description) {
  	const url = environment.apiUrl + '/api/techprofile/topics/' + topicId + '/lineitem/new';

  	const data = 'lineItemName='+name
  		+'&l0description='+l0description
  		+'&l1description='+l1description
  		+'&l2description='+l2description
  		+'&l3description='+l3description;

  	const rtn = new Promise(
  		(resolve, reject) => {
  			this._apiService.post(url, data).subscribe(
  				(_data) => {
  					console.log('POST addLineItem [' + name + '] API call returned');
  					console.log(_data);

  					resolve(_data);
  				}, (err) => {
  					reject(err);
  				});
  		});

  	return rtn;
  }

  updateLineItemWithDescriptions(lineItem) {
  	const url = environment.apiUrl + '/api/techprofile/lineitem/' + lineItem.id;
    let rtn = new Promise((resolve, reject) => { reject('invalid data'); });

  	if (lineItem.name !== undefined
        && lineItem.l0Description !== undefined
        && lineItem.l1Description !== undefined
        && lineItem.l2Description !== undefined
        && lineItem.l3Description !== undefined) {

        	rtn = new Promise(
        		(resolve, reject) => {
        			this._apiService.postUnsecuredAPI2(url, {lineItem}).subscribe(
        				(_data) => {
        					console.log('POST updateLineItem [' + lineItem.id + '] API call returned');
        					console.log(_data);

        					resolve(_data);
        				}, (err) => {
        					reject(err);
        				});
        		});
        }

  	return rtn;
  }

  updateTopic(topic) {
    const url = environment.apiUrl + '/api/techprofile/topic/' + topic.id;
    let rtn = new Promise((resolve, reject) => { reject('invalid data'); });

    if (topic.name !== undefined) {
      rtn = new Promise(
        (resolve, reject) => {
              this._apiService.postUnsecuredAPI2(url, {topic}).subscribe(
                (_data) => {
                  console.log('POST updateTopic [' + topic.id + '] API call returned');
                  console.log(_data);

                  resolve(_data);
                }, (err) => {
                  reject(err);
                });
            });
        }

    return rtn;
  }

  saveSequenceInfo(arr) {
    const url = environment.apiUrl + '/api/techprofile/sequences';
    const rtn = new Promise(
      (resolve, reject) => {
        this._apiService.postUnsecuredAPI2(url, {arr}).subscribe(
          (_data) => {
            console.log('POST sequence info API call returned');
            console.log(_data);
            resolve(_data);
          }, (err) => {
            reject(err);
          }
        );
      }
    );

    return rtn;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
	JSON_to_URLEncoded(scores){
		let list = '';

		let ctr = 0;
		scores.map((score) => {
			list += 'userId'+ctr+'='+score.userId;
			list += '&techProfileLineItemId'+ctr+'='+score.techProfileLineItemId;
			list += '&techProfileLineItemScore'+ctr+'='+score.techProfileLineItemScore;

			if (ctr+1 < scores.length)
				{list += '&';}

			ctr++;
		});

		list += '&count='+ (ctr);

		return list;
	}


}
