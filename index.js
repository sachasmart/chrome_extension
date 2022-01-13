import { apiKey } from './apiKey.js'
import { geoLocateKey } from './apiKey.js'

// document.getElementById('origin-input').placeholder = 'Testing'
let geoLocateUrl = `https://www.googleapis.com/geolocation/v1/geolocate?key=${geoLocateKey}`

fetch(geoLocateUrl, { method: 'POST' })
	.then((response) => response.json())
	.then((data) => console.log(data))

document.getElementById('form-el').addEventListener('submit', function (event) {
	event.preventDefault()
	const destinationInput = document.getElementById('destination-input').value
	const originInput = document.getElementById('origin-input').value
	const timeCost = document.getElementById('timeCost-input').value

	let gasPrice = 1.39
	let carMileage = 7 / 100
	let urlCompose =
		'https://maps.googleapis.com/maps/api/distancematrix/json?' +
		`destinations=${destinationInput}&origins=${originInput}&key=${apiKey}`
	fetch(urlCompose)
		.then((response) => response.json())
		.then((data) => {
			console.log(data)

			const totalDuration = data.rows[0].elements[0].duration.value / 60
			const totalDurationHours = totalDuration / 60
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
			).textContent = `Duration (min): ${totalDuration.toFixed(
				0
			)} minutes (${totalDurationHours.toFixed(1)} hrs)`

			document.getElementById(
				'timeCost-li'
			).textContent = `Cost of Time: $${totalTimeCost.toFixed(2)}`

			document.getElementById(
				'additionalResource'
			).innerHTML = `<style="border-top: 1px solid black"><a target="_blank" href="https://terrapass.com/product/productindividuals-families">Purchase Carbon-offsets for your <u>${distanceValue.toFixed(
				0
			)}km trip</u> to ${location}</style>`
		})
})
