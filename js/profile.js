 // ************************************* fa fa-arrow-left event ***************************************//
 const arrowLeft = document.querySelector('.fa-arrow-left');
 arrowLeft.addEventListener('click', () => {
     window.history.go(-1);
 });