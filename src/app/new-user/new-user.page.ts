import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { AlertService } from '../_services/alert.service';
import { UserService } from '../_services/user.service';

import { CountryPhone } from './country-phone.model';
import { PhoneValidator } from '../validators/phone.validator';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.page.html',
  styleUrls: ['./new-user.page.scss'],
})
export class NewUserPage implements OnInit {

  	name = undefined;
  	phone = undefined;
  	email = undefined;

  	validationsForm: FormGroup;
  	countryPhoneGroup: FormGroup;

  	countries: Array<CountryPhone>;

    constructor(private _location: Location,
			    private _router: Router,
			    private _route: ActivatedRoute,
    			private _userService: UserService,
    			private _alertService: AlertService,
    			private formBuilder: FormBuilder ) {

    }

  // eslint-disable-next-line @typescript-eslint/member-ordering
	validationMessages = {
		name: [
		  { type: 'required', message: 'Name is required.' }
		],
		email: [
		  { type: 'required', message: 'Email is required.' },
		  { type: 'pattern', message: 'Please enter a valid email.' }
		],
		phone: [
		  { type: 'required', message: 'Phone is required.' },
		  { type: 'validCountryPhone', message: 'The phone should be ten digits long.' }
		]
	};

  	ngOnInit() {
		this.name = '';
		this.email = undefined;
		this.phone = undefined;

	    this.countries = [
	      new CountryPhone('US', 'United States')
	    ];

	    const country = new FormControl(this.countries[0], Validators.required);
	    const phone = new FormControl('', Validators.compose([
	      PhoneValidator.validCountryPhone(country)
	    ]));
	    this.countryPhoneGroup = new FormGroup({
	      country,
	      phone
	    });

		this.validationsForm = this.formBuilder.group({
		  name: new FormControl('', Validators.required),
		  email: new FormControl('', Validators.compose([
		    Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
		  ])),
		  countryPhone: this.countryPhoneGroup
		});
	}

	ionViewWillEnter() {
		this.ngOnInit();
	}

	onNameChange($event) {
		this.name = $event.currentTarget.value;
	}

	getName() {
		return this.name;
	}

	onPhoneChange($event) {
		this.phone = $event.currentTarget.value;
	}

	getPhone() {
		return this.phone;
	}

	onEmailChange($event) {
		this.email = $event.currentTarget.value;
	}

	getEmail() {
		return this.email;
	}

	isSaveBtnEnabled() {
		let rtn = this.name && this.name.length > 3;
		let atLeastOneFieldIsValid = false;

		if (this.phone) {
			rtn = rtn &&
        this.validationsForm.get('country_phone') !== null &&
        (!!this.validationsForm.get('country_phone').errors === false) && this.phone.length === 10;

			if (rtn) {atLeastOneFieldIsValid = true;}
		}

		if (this.email) {
			rtn = rtn &&
        this.validationsForm.get('email') !== null &&
        (!!this.validationsForm.get('email').errors === false) && this.email.length > 6;

			if (rtn) {atLeastOneFieldIsValid = true;}
		}

		return rtn && atLeastOneFieldIsValid;
	}

	onSaveBtnClicked() {
		console.log('Save Btn Clicked!');

    	const self = this;

    	const DEFAULT_PASSWORD = 'password11';

    	self._userService.createNewUser(this.name, this.phone, this.email, DEFAULT_PASSWORD).then((user) => {
			self._userService.markUserAsAttending(user['id']).then(() => {
				self._alertService.show({
					header: 'You\'re in!',
					message: 'Your profile has been created. Please hand the tablet to the next person. Thanks!',
					buttons: [
						{
							text: 'OK', role: 'cancel', handler: () => {
								self._router.navigate(['/home']);
							}
						}
					]
				});
			});
    	});
	}

	onCancelBtnClicked() {
		console.log('Cancel Btn Clicked!');
    	this._router.navigate(['/home']);
	}
}
