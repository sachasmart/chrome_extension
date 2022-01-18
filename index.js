import {
	apiKey,
	geoLocateKey,
	TWILIO_ACCOUNT_SID,
	TWILIO_AUTH_TOKEN,
	TWILIO_PHONE_NUMBER,
	mongodb_gas_price,
	gas_price_api_key,
} from './apiKey.js'

let geoLocateUrl = `https://www.googleapis.com/geolocation/v1/geolocate?key=${geoLocateKey}`

document.getElementById('form-el').addEventListener('submit', function (event) {
	event.preventDefault()
	document.getElementById('results').style.display = 'block'

	const destinationInput = document.getElementById('destination-input').value
	const originInput = document.getElementById('origin-input').value
	const timeCost = document.getElementById('timeCost-input').value

	let gasPrice = 1.39
	let carMileage = 7 / 100
	let urlCompose =
		'https://maps.googleapis.com/maps/api/distancematrix/json?' +
		`destinations=${destinationInput}&origins=${originInput}&key=${apiKey}`
	// //Gas Price API

	//Google Maps Fetch
	fetch(urlCompose)
		.then((response) => response.json())
		.then((data) => {
			console.log(data)

			let totalDuration = data.rows[0].elements[0].duration.value / 60
			let totalDurationHours = totalDuration / 60
			const totalTimeCost = timeCost * totalDurationHours
			const distanceValue = data.rows[0].elements[0].distance.value / 1000
			const distanceCost =
				((distanceValue * carMileage) / 100) * (gasPrice * 100)
			const location = data.destination_addresses[0]
			console.log(location)
			let totalCost = totalTimeCost + distanceCost

			document.getElementById(
				'totalCost-el'
			).textContent = `Total Trip Cost: $${totalCost.toFixed(2)}`

			document.getElementById(
				'distance-li'
			).textContent = `Distance:  ${distanceValue.toFixed(0)} KM`

			document.getElementById(
				'gas-li'
			).textContent = `Gas:  $${distanceCost.toFixed(2)}`

			document.getElementById(
				'duration-li'
			).textContent = `Duration: ${totalDuration.toFixed(
				0
			)} minutes (${totalDurationHours.toFixed(1)} hrs)`

			document.getElementById(
				'timeCost-li'
			).textContent = `Cost of Time: $${totalTimeCost.toFixed(2)}`
		})
	// Fetch Google Maps directions
	let destinationInputEncoded = encodeURIComponent(destinationInput)
	let originInputEncoded = encodeURIComponent(originInput)
	let directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originInputEncoded}&destination=${destinationInputEncoded}&travelmode=driving`
	document
		.getElementById('sendDirections')
		.addEventListener('click', function (sendText) {
			sendText.preventDefault
			let sendingNumber = document.getElementById('phoneNumber').value
			console.log(sendingNumber)
			// Twilio Post
			let myHeaders = new Headers()
			myHeaders.append(
				'Authorization',
				'Basic QUM1NjE1YTliODBjYTg2N2RiMTNmZTBjOGE5NDhiMjJlYToyYTQzNTI5ODJhZWIwNzBmODQzMTE5ZDU4MDdjNWY3ZA=='
			)
			myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')

			let urlencoded = new URLSearchParams()
			urlencoded.append('To', sendingNumber)
			urlencoded.append('Body', `📍Google Maps Directions: ${directionsUrl}`)
			urlencoded.append('From', '+19378836682\n')

			let requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: urlencoded,
				redirect: 'follow',
			}

			fetch(
				'https://api.twilio.com/2010-04-01/Accounts/AC5615a9b80ca867db13fe0c8a948b22ea/Messages.json',
				requestOptions
			)
				.then((response) => response.text())
				.then((result) => console.log(result))
				.catch((error) => console.log('error', error))
		})
})
