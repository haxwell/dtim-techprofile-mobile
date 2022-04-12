import { Injectable } from '@angular/core';

import { TechProfileAPIService } from './tech-profile-api.service';


@Injectable({
  providedIn: 'root'
})
export class UserTechProfileModelService {

	userScores = undefined;
	userId = undefined;
	dirty = false;

	constructor(protected _techProfileAPI: TechProfileAPIService) {

	}

	init(userId) {
		const self = this;

		if (userId !== self.userId) {

			self.userId = userId;

			self._techProfileAPI.getScores(userId).then((scores) => {
				self.userScores = scores;
			});
		} else {
			console.log('UserTechProfileModelService did NOT init. Not sure if thats a good or bad thing');
		}
	}

	waitingPromise() {
		const self = this;
		return new Promise<void>((resolve, reject) => {

      const to = () => {
				setTimeout(() => {
					if (self.isUserScoresAvailable())
						{resolve();}
					else
						{to();}
				}, 600);
			};

			to();
		});
	}

	isDirty() {
		return this.dirty;
	}

	setDirty() {
		this.dirty = true;
	}

	isUserScoresAvailable() {
		return !!this.userScores;
	}

	getScore(lineItemId) {
		let rtn;

		if (this.userScores) {
			const score = this.userScores.find((s) => s.techProfileLineItemId === lineItemId);

			rtn = !!score ? score.techProfileLineItemScore : undefined;
		}

		return rtn;
	}

	clearScore(lineItemId) {
		this.userScores = this.userScores.filter((s) => s.techProfileLineItemId !== lineItemId);
	}

	setLineItemScore(lineItemId, idx) {
		const self = this;
		return new Promise((resolve, reject) => {
			if (self.userScores) {
				let score = self.userScores.find((s) => s.techProfileLineItemId === lineItemId);
				const prevScore = Object.assign({}, score);

				if (score) {
					score.techProfileLineItemScore = idx;
				} else {
					score = {
						userId: self.userId,
						techProfileLineItemId: lineItemId,
						techProfileLineItemScore: idx
					};

					self.userScores.push(score);
				}

				self.setDirty();
				resolve({prevScore, newScore: score});
			} else {
				resolve(undefined);
			}
		});
	}

	save() {
		const self = this;
		return new Promise((resolve, reject) => {
			if (self.isDirty()) {
				self._techProfileAPI.saveScores(self.userId, self.userScores).then((_data) => {
					self.dirty = false;
					resolve(_data);
				});
			} else {
				resolve(undefined);
			}
		});
	};
}
