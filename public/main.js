/*********************************************************************************
 * WEB422 – Assignment 2
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: ______________________ Student ID: __________________ Date: ____________________
 ********************************************************************************/

let page = 1; // Keeps track of the current page the user is on
const perPage = 10; // Number of movies displayed per page

document.addEventListener("DOMContentLoaded", function () {
  loadMovieData();

  // Event listener for the "Previous Page" button
  document.querySelector("#previous-page").addEventListener("click", function () {
    if (page > 1) {
      page--;
      loadMovieData();
    }
  });

  // Event listener for the "Next Page" button
  document.querySelector("#next-page").addEventListener("click", function () {
    page++;
    loadMovieData();
  });

  // Event listener for the "Search Form" submit button
  document.querySelector("#searchForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.querySelector("#title").value;
    loadMovieData(title);
  });

  // Event listener for the "Clear Form" button
  document.querySelector("#clearForm").addEventListener("click", function () {
    document.querySelector("#title").value = "";
    loadMovieData();
  });
});

// Function to load movie data from the API and display it on the page
function loadMovieData(title = null) {
  let url = `/api/movies?page=${page}&perPage=${perPage}`;
  if (title) {
    url += `&title=${title}`;
    page = 1; // Reset page to 1 when searching
    document.querySelector(".pagination").classList.add("d-none"); // Hide pagination if searching
  } else {
    document.querySelector(".pagination").classList.remove("d-none"); // Show pagination
  }

  // Fetch movie data from the API
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const movieTableBody = document.querySelector("#moviesTable tbody");
      movieTableBody.innerHTML = data.map((movie) => `
        <tr data-id="${movie._id}">
          <td>${movie.year}</td>
          <td>${movie.title}</td>
          <td>${movie.plot ? movie.plot : "N/A"}</td>
          <td>${movie.rated ? movie.rated : "N/A"}</td>
          <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60).toString().padStart(2, '0')}</td>
        </tr>
      `).join("");

      // Update the current page number in the pagination
      document.querySelector("#current-page").innerText = page;

      // Add click events to each row to show the modal with movie details
      document.querySelectorAll("#moviesTable tbody tr").forEach(row => {
        row.addEventListener("click", function () {
          const movieId = this.dataset.id;
          fetch(`/api/movies/${movieId}`)
            .then((res) => res.json())
            .then((movie) => {
              document.querySelector("#detailsModal .modal-title").innerText = movie.title;
              document.querySelector("#detailsModal .modal-body").innerHTML = `
                <img class="img-fluid w-100" src="${movie.poster}"><br><br>
                <strong>Directed By:</strong> ${movie.directors.join(", ")}<br><br>
                <p>${movie.fullplot}</p>
                <strong>Cast:</strong> ${movie.cast ? movie.cast.join(", ") : "N/A"}<br><br>
                <strong>Awards:</strong> ${movie.awards.text}<br>
                <strong>IMDB Rating:</strong> ${movie.imdb.rating} (${movie.imdb.votes} votes)
              `;
              const modal = new bootstrap.Modal(document.getElementById("detailsModal"));
              modal.show();
            });
        });
      });
    })
    .catch((err) => console.log(`Error: ${err}`));
}
