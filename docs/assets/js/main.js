// Loading screen variables
const loading_screen = document.getElementById('loading_screen');
const overlay = document.getElementById('blur_overlay');
const popups = document.querySelectorAll('.popup_container');

var min_load_time = 500; // in ms   
var elapsed_time = false;
var loaded = false;

// Loading page
var hide_loading_screen = function() {
    if (elapsed_time && loaded) {
        loading_screen.style.display = 'none';
        document.querySelector('#landing_text').classList.add('animated');
    }
};

window.addEventListener('load', function() {
    loaded = true;
    hide_loading_screen();
});

setTimeout(() => {
    elapsed_time = true;
    hide_loading_screen();
}, min_load_time);

// Reload at top of page
window.onbeforeunload = function () {
        window.scrollTo(0, 0);
      };

// Article popup mechanics
function open_article(artID) 
{
    document.getElementById(artID).style.display='block';
    overlay.style.display='block';
    document.querySelector('body').style.overflow='hidden';
}
function close_article(artID)
{
    document.getElementById(artID).style.display='none';
    overlay.style.display='none';
    document.querySelector('body').style.overflow='auto';
}
function close_all_popups()
{
    popups.forEach(popup => {
        popup.style.display='none';
    })
    overlay.style.display='none';
    document.querySelector('body').style.overflow='auto';
}
function stop_propagation(){
    event.stopPropagation();
}
// Add listeners
overlay.addEventListener('click', close_all_popups);  // Add to blur overlay only
popups.forEach(popup => {
    popup.addEventListener('click', stop_propagation)
})