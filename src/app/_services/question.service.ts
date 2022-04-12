import {Injectable} from '@angular/core';
import {ApiService} from './api.service';

import {environment} from '../../_environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

	constructor(private _apiService: ApiService) {

	}

  getLineItemLevelAssociations(questionId) {
    const url = environment.apiUrl + '/api/question/' + questionId + '/lineitem/levels';

    return new Promise(
      (resolve, reject) => {
        this._apiService.getUnsecuredAPI(url).subscribe(
          (data) => {
            resolve(data);
          }, (err) => {
            reject(err);
          });
      }
    );
  }

  setLineItemLevelAssociations(questionId, lilvassociations) {
    const url = environment.apiUrl + '/api/question/' + questionId + '/lineitem/levels';

    let data = '';

    for (let x=0; x < lilvassociations.length; x++) {
      if (x > 0) {data += '&';}

      data += 'liId' + x + '=' + lilvassociations[x][0] + '&liVal' + x + '=' + lilvassociations[x][1];
    }

    if (data.length > 0)
      {data += '&count=' + lilvassociations.length;}

    return new Promise(
      (resolve, reject) => {
        this._apiService.postUnsecuredAPI(url, data).subscribe(
          (_data) => {
            resolve(_data);
          }, (err) => {
            reject(err);
          });
      }
    );
  }

  getAll() {
      const url = environment.apiUrl + '/api/question/all';

    return new Promise(
        (resolve, reject) => {
          this._apiService.getUnsecuredAPI(url).subscribe(
            (data) => {
              resolve(data);
            }, (err) => {
              reject(err);
            });
        }
      );
  }

  getQuestionById(id) {
      const url = environment.apiUrl + '/api/question/' + id;

      const rtn = new Promise(
        (resolve, reject) => {
        this._apiService.getUnsecuredAPI(url).subscribe(
          (data) => {
            console.log('Call to getQuestionById(' + id + ') returned');
            console.log(data);
            resolve(data);
          }, (err) => {
            reject(err);
          });
        }
      );

      return rtn;
  }

  getByLineItemAndLevel(lineItemId, levelIdx) {
      const url = environment.apiUrl + '/api/question/' + lineItemId + '/' + levelIdx;

    return new Promise(
        (resolve, reject) => {
          this._apiService.getUnsecuredAPI(url).subscribe(
            (data) => {
              resolve(data);
            }, (err) => {
              reject(err);
            });
        }
      );
  }

	getUserHistoryForQuestion(userId, questionId) {
      const url = environment.apiUrl + '/api/user/' + userId + '/question/' + questionId + '/history';

      const rtn = new Promise(
        (resolve, reject) => {
        this._apiService.getUnsecuredAPI(url).subscribe(
          (data) => {
            resolve(data);
          }, (err) => {
            reject(err);
          });
        }
      );

      return rtn;
	}

  setSessionScore(userId, questionId, sessionId, dataObj) {
      const url = environment.apiUrl + '/api/user/' + userId + '/question/' + questionId + '/history';
      let data = 'sessionId=' + sessionId + '&score=' + dataObj.score;

      if (dataObj.comment)
        {data += '&comment=' + dataObj.comment;}

      const rtn = new Promise(
        (resolve, reject) => {
        this._apiService.postUnsecuredAPI(url, data).subscribe(
          (data) => {
            console.log('Question Session Score Updated!');
            console.log(data);

            resolve(data);
          }, (err) => {
            reject(err);
          });
      });

      return rtn;
  }

  save(question, lilvassociations) {
    const url = environment.apiUrl + '/api/question/save';

    return new Promise(
      (resolve, reject) => {
        this._apiService.postUnsecuredAPI2(url, {question, lilvassociations}).subscribe(
          (data) => {
            resolve(data);
          }, (err) => {
            reject(err);
          });
      });
  }

}
