describe('Tyre Pressure Monitoring System', function () {

	describe('Alarme', function () {
		const SEUIL_BAS = 16;
		const SEUIL_HAUT = 22;
		const PRESSION_OK = 18;
		const ALARME_ACTIVE = true;
		const ALARME_INACTIVE = false;

		it('prend le Sensor par défaut', function() {
			const alarm = new Alarm();
			expect(alarm._sensor instanceof Sensor).toBe(true);
		});

		testPressions([], 'éteinte par defaut', ALARME_INACTIVE);

		testPressions([SEUIL_BAS], 'est déclenchée quand la pression est trop basse', ALARME_ACTIVE);
		for (pression of [17, 18, 19, 20, 21]) {
			testPressions([pression], `n'est pas déclenchée quand la pression ${pression} est nominale`, ALARME_INACTIVE);
		}

		testPressions([SEUIL_HAUT], 'est déclenchée quand la pression est trop haute', ALARME_ACTIVE);

		testPressions([PRESSION_OK, SEUIL_HAUT], 'se déclenche quand la pression passe le seuil', ALARME_ACTIVE);

		testPressions([SEUIL_HAUT, PRESSION_OK], 'reste déclenchée quand la pression redevient acceptable', ALARME_ACTIVE);
	});

});

function testPressions(pressions, message, etatAlarme){
	it(message, function () {
		const fakeSensor = {
			popNextPressurePsiValue: function () { return this._pression; },
			setPression: function (pression) { this._pression = pression; }
		};

		var alarm = new Alarm(fakeSensor);
		pressions.forEach(function(pression) {
			fakeSensor.setPression(pression);
			alarm.check();	
		});

		expect(alarm.alarmOn()).toBe(etatAlarme);
	});
}
