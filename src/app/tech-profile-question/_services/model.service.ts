import { Injectable } from '@angular/core';

import { ApiService } from '../../_services/api.service';
import { FunctionPromiseService } from 'savvato-javascript-services';
import { environment } from '../../../_environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ModelService {

	GET_ALL_QUESTION_COUNTS_PER_CELL = 'getQuestionCountsForAllCells';
	GET_QUESTION_COUNT_OF_A_GIVEN_CELL = 'getQuestionCountForAGivenCell';
	GET_MAX_QUESTION_COUNT_FOR_ANY_CELL = 'highestQuestionCountForAnyCell';

	constructor(private _apiService: ApiService,
				private _functionPromiseService: FunctionPromiseService) {

	}

	_init() {
		let self;

		this._functionPromiseService.initFunc(this.GET_ALL_QUESTION_COUNTS_PER_CELL, () => new Promise((resolve, reject) => {
				const url = environment.apiUrl + '/api/techprofile/questionCountsPerCell';
				this._apiService.get(url)
				.subscribe((qcpc) => {
					resolve(qcpc);
				}, (err) => {
					reject(err);
				});
			}));

		this._functionPromiseService.initFunc(this.GET_QUESTION_COUNT_OF_A_GIVEN_CELL, (data) => new Promise((resolve, reject) => {
				const qcpc = data.questionCountsPerCell;

				if (!qcpc)
					{throw new Error('questionCountsPerCell needed.');}
				else {
					let rtn;
					let found = false;
					let passed = false;
					let i = 0;

					while (i < qcpc.length && i <= data.lineItemId && !passed && !found) {
						const curr = qcpc[i];

						passed = (curr[0] > data.lineItemId);

						if (!passed) {
							if (data.lineItemId == curr[0] && data.lineItemLevelIndex == curr[1]) {
								rtn = curr[2];
								found = true;
							}
						}

						i++;
					}

					resolve(rtn);
				}
			}));

		this._functionPromiseService.initFunc(this.GET_MAX_QUESTION_COUNT_FOR_ANY_CELL, (data) => new Promise((resolve, reject) => {
				const qcpc = data.questionCountsPerCell;

				let max;
				let i = 0;

				while (qcpc && i < qcpc.length) {
					const curr = qcpc[i];
					if (max === undefined || curr[2] > max) {max = curr[2];}
					i++;
				}

				resolve(max);
			}));
	}

	getQuestionCountForCell(id, idx) {
		const self = this;
		let rtn;

		const qcpc = this._functionPromiseService.get(self.GET_ALL_QUESTION_COUNTS_PER_CELL, self.GET_ALL_QUESTION_COUNTS_PER_CELL, { });

		if (qcpc) {
			const data = {lineItemId: id, lineItemLevelIndex: idx, questionCountsPerCell: qcpc};
			rtn = this._functionPromiseService.get(self.GET_QUESTION_COUNT_OF_A_GIVEN_CELL+''+id+'-'+idx, self.GET_QUESTION_COUNT_OF_A_GIVEN_CELL, data);
		}

		return rtn;
	}

	getHighestQuestionCountForAnyCell() {
		const self = this;
		let rtn;

		const qcpc = this._functionPromiseService.get(self.GET_ALL_QUESTION_COUNTS_PER_CELL, self.GET_ALL_QUESTION_COUNTS_PER_CELL, { });

		if (qcpc) {
			const data = {questionCountsPerCell: qcpc};
			rtn = this._functionPromiseService.get(self.GET_MAX_QUESTION_COUNT_FOR_ANY_CELL,self.GET_MAX_QUESTION_COUNT_FOR_ANY_CELL, data);
		}

		return rtn;
	}

	getPercentileForTheNumberOfQuestionsForThisCell(id, idx) {
		// get a count for each of the cells
		const self = this;
		const qcpc = this._functionPromiseService.get(self.GET_ALL_QUESTION_COUNTS_PER_CELL, self.GET_ALL_QUESTION_COUNTS_PER_CELL, { });

		if (qcpc) {
			const data = {questionCountsPerCell: qcpc};
			const gcqc = this._functionPromiseService.get(self.GET_QUESTION_COUNT_OF_A_GIVEN_CELL+''+id+'-'+idx, self.GET_QUESTION_COUNT_OF_A_GIVEN_CELL, data);


			if (qcpc) {
				const arr = qcpc.map((elem) => elem[2]); // arr of the question counts for each cell in the profile

				// sort array ascending
				const asc = _arr => _arr.sort((a, b) => a - b);

				const sum = _arr => _arr.reduce((a, b) => a + b, 0);

				const mean = _arr => sum(_arr) / arr.length;

				// sample standard deviation
				const std = (_arr) => {
				    const mu = mean(_arr);
				    const diffArr = _arr.map(a => (a - mu) ** 2);
				    return Math.sqrt(sum(diffArr) / (_arr.length - 1));
				};

				const calculateNtile = (_arr, q) => {
				    const sorted = asc(_arr);
				    const pos = ((sorted.length) - 1) * q;
				    const base = Math.floor(pos);
				    const rest = pos - base;
				    if ((sorted[base + 1] !== undefined)) {
				        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
				    } else {
				        return sorted[base];
				    }
				};

				let maxIdx = 0;
				[1,2,3,4,5,6,7,8,9,10].forEach(i => {
					const nTile = calculateNtile(arr, ((i + 1) / 10));
					if (nTile <= gcqc) {maxIdx++;}
				});

				return maxIdx;
			}
		}

		return undefined;
	}
}
