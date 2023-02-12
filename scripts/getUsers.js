let tableContent = document.getElementById("table_content");
let filterButtons = document.getElementsByClassName("filter");

const itemsPerPage = 10;
let currentPage = 1;

let ascOrder = true; // represents order status, true - ascending, false - descending

const fetchUsers = () => {
	return fetch("/data/users.json")
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			return data;
		});
};

/**
 * Function to display our data
 * in some container, tableContent for us.
 *
 * @param users - array of user data, sorted or not
 */
const displayUsers = (users) => {
	/**
	 * Removing old exiting data from table
	 * before filling it again with new sorted data
	 * to prevent generating copies.
	 */
	if (tableContent.firstChild) {
		tableContent.innerHTML = "";
	}

	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;

	const paginatedUsers = users.slice(startIndex, endIndex);

	/**
	 * Populating HTML with our paginated user data.
	 */
	paginatedUsers.forEach((user) => {
		const row = document.createElement("div"); // row represents our user
		row.classList.add("user");

		// row.addEventListener("click", (event) => {
		// 	// console.log(event.target);
		// 	let editForm = document.getElementById("form");
		//
		// 	let newFirstName = document.getElementById("new_firstname");
		// 	let newLastName = document.getElementById("new_lastname");
		// 	let newDescription = document.getElementById("new_description");
		// 	let newEyeColor = document.getElementById("new_eyecolor");
		//
		// 	let editButton = document.getElementById("edit");
		// 	let closeButton = document.getElementById("close");
		//
		// 	editForm.classList.toggle("show");
		//
		// 	console.log(row);
		//
		// 	editButton.addEventListener("click", () => {
		// 		console.log(row);
		// 	});
		// });
		//
		// row.removeEventListener("click", this);

		row.innerHTML = `
      	<p class="user-firstname">${user.name.firstName}</p>
      	<p class="user-lastname">${user.name.lastName}</p>
      	<p class="user-about">${user.about}</p>
      	<div class="user-eyecolor">
          	<svg viewBox="0 0 20 20">
              	<circle cx="10" cy="10" r="5" fill="${user.eyeColor}"/>
          	</svg>
      	</div>
    	`;

		tableContent.appendChild(row); // adding user row to the table
	});

	const totalPages = Math.ceil(users.length / itemsPerPage);
	const pagination = document.querySelector("#pagination_numbers");

	pagination.innerHTML = "";

	/**
	 * Generating pagination buttons
	 */
	for (let i = 1; i <= totalPages; i++) {
		const paginationButton = document.createElement("button");
		paginationButton.textContent = i.toString();

		if (i === currentPage) {
			paginationButton.classList.add("active");
		}

		paginationButton.addEventListener("click", () => {
			currentPage = i;
			displayUsers(users);
		});

		pagination.appendChild(paginationButton);
	}
};

/**
 * Sorts array of user by keyword
 *
 * @param users - array of user data
 * @param key - which prop we will sort, e.g. firstName or eyeColor
 * @returns {*}
 */
const sortUsers = (users, key) => {
	return users.sort((a, b) => {
		let propA = a[key];
		let propB = b[key];

		if (key === "firstName" || key === "lastName") {
			propA = a.name[key];
			propB = b.name[key];
		}

		if (!ascOrder) {
			if (propA < propB) return 1;
			if (propA > propB) return -1;

			return 0;
		} else {
			if (propA < propB) return -1;
			if (propA > propB) return 1;

			return 0;
		}
	});
};

/**
 * Adding event listeners to every header button,
 * like First Name, Last Name etc.
 *
 * I could split this into 4 different buttons, like filterByFirstName etc.,
 * with this implementation I would not have any problems with order status, active class,
 * but code would look so much worse. So I don't know which way would be better.
 */
for (let button of filterButtons) {
	/**
	 * This 'status' variable is a little workaround to represent current sort order,
	 * because working with vanilla js is LITTLE tough,
	 * I think this is an appropriate way to display current order status.
	 */
	const status = document.createElement("img");
	button.appendChild(status);

	button.addEventListener("click", (event) => {
		const key = event.target.id.replace(" ", "");

		ascOrder = ascOrder !== true;

		if (ascOrder) {
			status.src = "assets/icons/ui/ascend.svg";
		} else {
			status.src = "assets/icons/ui/descend.svg";
		}

		fetchUsers().then((users) => {
			const sorted = sortUsers(users, key);
			displayUsers(sorted);
		});
	});
}

fetchUsers().then((users) => {
	displayUsers(users);
});
