const swup = new Swup({
  animateHistoryBrowsing: false,
});

const navbar = document.querySelectorAll('.navbar')[0];
const navs = navbar.querySelectorAll('a');
const burger = document.querySelectorAll('.navbar-burger')[0];
const menu = document.querySelectorAll('.navbar-menu')[0];





burger.onclick = (e) => {
  burger.classList.toggle('is-active');
  menu.classList.toggle('is-active');
};

for (var i = 0; i < navs.length; i++) {
  if (!navs[i].classList.contains('navbar-burger')) {
    navs[i].onclick = () => {
      if (burger.classList.contains('is-active')) {
        burger.classList.toggle('is-active');
        menu.classList.toggle('is-active');
      }
    }
  }
}

const send_data = async (data) => {
  const result_container = document.getElementById('result_container');
    const Url = document.getElementById("url").value;
    const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(Url)}`);
    if (response.ok) {
        const data = await response.text();
  
  console.log(data)
  result_container.classList.remove('is-hidden');
        document.getElementById('result').innerHTML = `
        shortend URL : <a href="${data }" target="_blank" class="has-text-white has-text-weight-light"> ${data}</a>`;
    }
    else{
        document.getElementById('result').innerHTML = "Error shortening"
    }
}


const arm_url_form = () => {
  const url_form = document.getElementById('url_form');

  if (url_form) {
    url_form.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent default form submission

      const url_input = url_form.querySelector('input[name="url"]');
      url_form.submit.classList.add('is-loading');
      url_input.disabled = true;
      const data = new FormData();
      data.append('url', url_input.value);

      // Call send_data function to handle form submission asynchronously
      send_data(data)
        .then((res) => {
          console.log(res);
          setTimeout(function() {
            url_form.submit.classList.remove('is-loading');
            url_input.disabled = false;
          }, 1000);
        })
        .catch(error => {
          console.error('Error:', error);
          url_input.disabled = false;
        });
    });
  }
}

// Call arm_url_form to ensure it's executed when the page loads
document.addEventListener("DOMContentLoaded", function(e) {
  arm_url_form();
});



const arm_main_tabs = () => {
  const main_tabs = document.querySelectorAll('.tabs.main a');
  const tab_containers = document.querySelectorAll('.tab_container');

  if (main_tabs) {
    for (var i = 0; i < main_tabs.length; i++) {
      main_tabs[i].addEventListener('click', function(e) {

        for (var i = 0; i < main_tabs.length; i++) {
          main_tabs[i].parentNode.classList.remove('is-active');
        }

        for (var i = 0; i < tab_containers.length; i++) {
          tab_containers[i].classList.add('is-hidden');
        }

        let target_div = document.getElementById(e.target.getAttribute('data-id'));
        target_div.classList.add('animate__fadeIn');
        target_div.classList.remove('is-hidden');

        e.target.parentNode.classList.add('is-active');

      })
    }
  }
}


swup.on('contentReplaced', () => {
  arm_url_form();
  arm_main_tabs();
});

document.addEventListener('swup:animationOutStart', (e) => {
  //window.scrollTo(0, 0);
});

document.addEventListener("DOMContentLoaded", function(e) {
  console.log('DOM LOADED');
  window.scrollTo(0, 0);
  arm_url_form();
  arm_main_tabs();
});

