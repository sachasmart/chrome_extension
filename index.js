import { apiKey } from './apiKey.js'

document.getElementById('form-el').addEventListener('submit', function (event) {
	event.preventDefault()
	const destinationInput = document.getElementById('destination-input').value
	const originInput = document.getElementById('origin-input').value
	const timeCost = document.getElementById('timeCost-input').value
	// const apiKey = 'AIzaSyDXZu_RZuEn95Je0GiUw2K75QAaZzHxLBA'
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
				'timeCost-li'
			).textContent = `Cost of Time: ${timeCost}`

			document.getElementById(
				'duration-li'
			).textContent = `Duration (min): ${totalDuration.toFixed(
				0
			)} minutes (${totalDurationHours.toFixed(1)} hrs)`

			document.getElementById(
				'additionalResource'
			).innerHTML = `<style="border-top: 1px solid black"><a target="_blank" href="https://terrapass.com/product/productindividuals-families">Purchase Carbon-offsets for your <u>${distanceValue.toFixed(
				0
			)}km trip</u></style>`
		})
})
