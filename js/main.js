/*
 *    Menu 
 */

const nav = document.querySelector('[data-nav]');
const menuBtn = document.querySelector('[data-toggle-nav]');

menuBtn.addEventListener('click', () => {
   [nav, menuBtn].forEach(el => {
      el.toggleAttribute('data-active');
      if (el === nav);
         el.toggleAttribute('data-not-active');
   });
});

/*
 *    Carousel 
 */

const API_URL = './data.json';
const transitionDuration = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--transition-duration')); // Getting value of CSS var for transition duration

const carouselElements = {
   //! KEYS MUST BE SAME AS KEYS IN DATA FILE
   destination: { // HTML Elements for 'destination' page
      name: document.querySelector('[data-name-planet]'),
      images: document.querySelector('[data-img-planet]'),
      description: document.querySelector('[data-desc-planet]'),
      distance: document.querySelector('[data-distance]'),
      travel: document.querySelector('[data-travel]'),
   },
   crew: { // HTML Elements for 'crew' page
      name: document.querySelector('[data-name-crew]'),
      images: document.querySelector('[data-img-crew]'),
      bio: document.querySelector('[data-bio]'),
      role: document.querySelector('[data-role]'),
   },
   technology: { // HTML Elements for 'technology' page
      name: document.querySelector('[data-name-tech]'),
      images: document.querySelector('[data-img-tech]'),
      description: document.querySelector('[data-desc-tech]'),
   }
}

fetch(API_URL)
.then(response => response.json())
.then(data => {
   const navWrapper = document.querySelector('[data-nav-wrapper]');
   if (!navWrapper) return; // No 'navWrapper' === No carousel on page === No need for further code
   const navs = [...navWrapper.children];

   const carouselName = document.querySelector('[data-carousel]').getAttribute('data-carousel'); // There can be only one [data-carousel] per page...
   if (!data.hasOwnProperty(carouselName)) return console.error('Unknown carousel name: ' + carouselName); // ...and it must match one of properties in 'data'
   
   navWrapper.addEventListener('click', e => {
      const activeNav = navWrapper.querySelector('[data-active]');
      const indexOfClickedNav = navs.indexOf(e.target);
      if (e.target.tagName !== 'BUTTON' ||
            activeNav === navs[indexOfClickedNav]
         ) return;
      const elements = carouselElements[carouselName];
      const newData = data[carouselName][indexOfClickedNav];
   
      // Passing `data-active` attribute to clicked navigator
      activeNav.removeAttribute('data-active');
      navs[indexOfClickedNav].setAttribute('data-active', '');
   
      setOpacity(elements, 0); // Hide elements.
      setTimeout(() => { // Wait for elements to turn completely invisible...
         replaceInfo(elements, newData); // ...then replace info in HTML elements
         setOpacity(elements, '100%'); // and show elements again
      }, transitionDuration);
   });
})
.catch(err => console.error('Error fetching data: ' + err));

function setOpacity(obj, opacity) {
   Object.values(obj).forEach(el => {
      /* crew role is the only element that has opacity 50%, 
      so we need this `if` to keep it that way */
      if (el.hasAttribute('data-role')) {
         opacity = !opacity ? 0 : '50%';
         el.style.opacity = opacity;
      }
      else
         el.style.opacity = opacity;
   })
}

function replaceInfo(obj, newData) {
   Object.entries(obj).forEach(([key, element]) => {
      switch (element.tagName) {
         case 'IMG':
            element.src = newData[key].webp;
            element.alt = newData.name;
            break;
         case 'PICTURE':
            /* Handling <picture> element in 'technology' page */
            const pictureHTML = `
               <source 
                  srcset="${newData[key]['portrait']}"
                  media="(min-width: 992px)" 
               />
               <img class="tech-img" src="${newData[key]['landscape']}" alt="${newData.name}" />
            `;
            element.innerHTML = pictureHTML;
            break;
         default:
            element.innerText = newData[key];
            break;
      }
   });
}
