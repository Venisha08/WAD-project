document.addEventListener('DOMContentLoaded', () => {
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      // Inject header HTML into the placeholder
      document.getElementById('header-placeholder').innerHTML = data;

      // Define an array of gradient themes
      const themes = [
        { backgroundColor: 'linear-gradient(to right, #ff7e5f, #feb47b)', textColor: '#000', buttonText: 'Sunset Mode' },
        { backgroundColor: 'linear-gradient(to right, #6a11cb, #2575fc)', textColor: '#fff', buttonText: 'Purple Blue Mode' },
        { backgroundColor: 'linear-gradient(to right, #ff6a00, #ee0979)', textColor: '#fff', buttonText: 'Warm Glow Mode' },
        { backgroundColor: 'linear-gradient(to right, #00c6ff, #0072ff)', textColor: '#fff', buttonText: 'Cool Blue Mode' },
        { backgroundColor: 'radial-gradient(circle, #f6d365, #fda085)', textColor: '#000', buttonText: 'Golden Glow Mode' },
        { backgroundColor: 'radial-gradient(circle, #84fab0, #8fd3f4)', textColor: '#000', buttonText: 'Mint Sky Mode' },
        { backgroundColor: 'linear-gradient(to right, #f953c6, #b91d73)', textColor: '#fff', buttonText: 'Pink Purple Mode' },
        { backgroundColor: 'white', textColor: 'black', buttonText: 'Light Mode' },
      ];

      let currentThemeIndex = 0;

      // Add the event listener to the theme toggle button AFTER loading the header
      const themeButton = document.getElementById('themeButton');

      themeButton.addEventListener('click', () => {
        // Apply the current theme
        const theme = themes[currentThemeIndex];
        document.body.style.background = theme.backgroundColor; // Use 'background' for gradients
        document.body.style.color = theme.textColor;
        themeButton.textContent = theme.buttonText;

        // Change the background of elements with the 'timer-container' class
        document.querySelectorAll('.timer-container').forEach(timer => {
          timer.style.background = theme.backgroundColor; // Use the same background as the body
          timer.style.color = theme.textColor;
        });

        // Move to the next theme in the array
        currentThemeIndex = (currentThemeIndex + 1) % themes.length; // Loop back to the first theme
      });

      // Hamburger Menu
      const hamburgerMenu = document.getElementById('hamburgerMenu');
      const navLinks = document.getElementById('navLinks');

      // Toggle the 'active' class when hamburger menu is clicked
      hamburgerMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
      });
    })
    .catch(error => console.error('Error loading header:', error));
});
