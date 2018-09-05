var buttonLink = document.getElementById('linkbutton');

console.log(role)

		if (role === 'Hospital Administrator') {
			buttonLink.href = '/front_desk';
			buttonLink.innerHTML = 'Front Desk';
		}

		if (role === 'IT Administrator') {
			buttonLink.href = '/front_desk';
			buttonLink.innerHTML = 'Front Desk';
		}

		if (role === 'Nurse') {
			buttonLink.href = '/nurses_station';
			buttonLink.innerHTML = 'Nurses Station';
		}

		if (role === 'Doctor') {
			buttonLink.href = '/doctors_office';
			buttonLink.innerHTML = "Doctor's Office";
		}

		if (role === 'Pharmacist') {
			buttonLink.href = '/pharmacy';
			buttonLink.innerHTML = 'Pharmacy';
		}

		if (role === 'Lab Technician') {
			buttonLink.href = '/laboratory';
			buttonLink.innerHTML = 'Medical Lab';
		}